import { 
  subscribers, users, marketingEmails, emailLogs, resetRuns, resetItems,
  type Subscriber, type InsertSubscriber, type User, type InsertUser, 
  type MarketingEmail, type InsertMarketingEmail, type EmailLog, type InsertEmailLog,
  type ResetRun, type InsertResetRun, type ResetItem, type InsertResetItem,
  type ResetEntry, type InsertResetEntry, resetEntries,
  agentLeads, agentInteractions, agentVideos,
  type AgentLead, type InsertAgentLead, type AgentInteraction, type InsertAgentInteraction,
  type AgentVideo, type InsertAgentVideo
} from "@shared/schema";
import session from "express-session";
import { db, pool, ensureProductionTables } from "./db";
import { eq, asc, desc, and, sql, lte, lt } from "drizzle-orm";
import connectPgSimple from "connect-pg-simple";
import createMemoryStore from "memorystore";
import { computeDelayedSchedule } from "./reset/rescheduler";

const PostgresSessionStore = connectPgSimple(session);
const MemoryStore = createMemoryStore(session);

export type StartResetResult = 
  | { type: "not_found" }
  | { type: "invalid_state" }
  | { type: "corrupt_state" }
  | { type: "already_active"; resetRun: ResetRun; items: ResetItem[] }
  | { type: "success"; resetRun: ResetRun; items: ResetItem[] };

export type AdvanceResetResult =
  | { type: "not_found" }
  | { type: "item_not_found" }
  | { type: "conflict" }
  | { type: "corrupt_state" }
  | { type: "reflection_required" }
  | { type: "success"; resetRun: ResetRun; items: ResetItem[] }
  | { type: "already_done"; resetRun: ResetRun; items: ResetItem[] };

export type StartNextMorningResult =
  | { type: "not_found" }
  | { type: "invalid_state" }
  | { type: "corrupt_state" }
  | { type: "success"; resetRun: ResetRun; items: ResetItem[] }
  | { type: "already_active"; resetRun: ResetRun; items: ResetItem[] };

export type DelayResetResult =
  | { type: "not_found" }
  | { type: "invalid_lifecycle" }
  | { type: "stale_revision" }
  | { type: "item_not_found" }
  | { type: "conflict" }
  | { type: "corrupt_state" }
  | { type: "schedule_conflict" }
  | { type: "success"; resetRun: ResetRun; items: ResetItem[] };

export type SaveEntryResult =
  | { type: "not_found" }
  | { type: "invalid_lifecycle" }
  | { type: "success"; entry: ResetEntry };

export interface IStorage {
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  getAllSubscribers(): Promise<Subscriber[]>;
  
  // User authentication methods
  createUser(user: InsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUser(id: number): Promise<User | undefined>;
  getUserByStripeSessionId(sessionId: string): Promise<User | undefined>;
  
  // Email functionality
  addMarketingEmail(data: InsertMarketingEmail): Promise<MarketingEmail>;
  logEmail(data: InsertEmailLog): Promise<EmailLog>;
  getAllEmailLogs(): Promise<EmailLog[]>;
  getMarketingEmails(): Promise<MarketingEmail[]>;
  
  // Reset functionality
  getResetRunByUserId(userId: number): Promise<ResetRun | undefined>;
  getResetRunAndItemsByUserId(userId: number): Promise<{ resetRun: ResetRun; items: ResetItem[] } | undefined>;
  createResetRun(
    resetRun: Omit<InsertResetRun, "id" | "createdAt" | "updatedAt">,
    items: Omit<InsertResetItem, "id" | "resetRunId" | "createdAt" | "updatedAt">[]
  ): Promise<{ resetRun: ResetRun; items: ResetItem[] } | { existingRun: ResetRun }>;
  startResetRunForUser(userId: number): Promise<StartResetResult>;
  advanceResetItemForUser(userId: number, itemId: number, action: "complete" | "skip"): Promise<AdvanceResetResult>;
  delayResetItemForUser(userId: number, itemId: number, delayMinutes: number, expectedScheduleRevision: number): Promise<DelayResetResult>;
  startNextMorningForUser(userId: number): Promise<StartNextMorningResult>;
  saveResetEntryForUser(userId: number, kind: string, content: string): Promise<SaveEntryResult>;
  getResetEntriesForUser(userId: number): Promise<{ type: "not_found" } | { type: "success", entries: ResetEntry[] }>;
  updateResetFoodPreferenceForUser(userId: number, foodPreference: string): Promise<{ type: "not_found" } | { type: "success", resetRun: ResetRun }>;

  // Autonomous Agent Lead & Interaction methods
  upsertAgentLead(data: Partial<InsertAgentLead> & { email: string }): Promise<AgentLead>;
  getAgentLeadByEmail(email: string): Promise<AgentLead | undefined>;
  getAllAgentLeads(): Promise<AgentLead[]>;
  getDueAgentLeads(now?: Date): Promise<AgentLead[]>;
  updateAgentLeadStage(email: string, nurtureStage: number, nextEmailAt: Date | null): Promise<AgentLead | undefined>;
  markAgentLeadPurchased(email: string): Promise<AgentLead | undefined>;
  unsubscribeAgentLead(email: string): Promise<AgentLead | undefined>;
  createAgentInteraction(data: InsertAgentInteraction): Promise<AgentInteraction>;
  getRecentAgentInteractions(limit?: number): Promise<AgentInteraction[]>;

  // Agent Videos (AI Video Director & Approval Queue)
  getAgentVideos(): Promise<AgentVideo[]>;
  getAgentVideoById(id: number): Promise<AgentVideo | undefined>;
  createAgentVideo(data: InsertAgentVideo): Promise<AgentVideo>;
  updateAgentVideo(id: number, data: Partial<InsertAgentVideo>): Promise<AgentVideo | undefined>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  private fallbackMem: MemStorage;

  constructor() {
    this.fallbackMem = new MemStorage();
    try {
      this.sessionStore = new PostgresSessionStore({
        pool,
        createTableIfMissing: true,
      });
    } catch (err) {
      console.warn("Warning: Failed to initialize PostgresSessionStore, falling back to MemoryStore:", err);
      this.sessionStore = this.fallbackMem.sessionStore;
    }

    ensureProductionTables().catch((err) => {
      console.warn("Non-fatal schema auto-check warning:", err?.message || err);
    });
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    try {
      const [subscriber] = await db
        .insert(subscribers)
        .values(insertSubscriber)
        .returning();
      return subscriber;
    } catch {
      return this.fallbackMem.createSubscriber(insertSubscriber);
    }
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    try {
      const [subscriber] = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.email, email));
      return subscriber || undefined;
    } catch {
      return this.fallbackMem.getSubscriberByEmail(email);
    }
  }

  async getAllSubscribers(): Promise<Subscriber[]> {
    try {
      return await db.select().from(subscribers);
    } catch {
      return this.fallbackMem.getAllSubscribers();
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values(insertUser)
        .returning();
      return user;
    } catch (err) {
      console.warn("createUser fallback:", err);
      return this.fallbackMem.createUser(insertUser);
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
      return user || undefined;
    } catch {
      return this.fallbackMem.getUserByUsername(username);
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return undefined;
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(sql`LOWER(${users.email}) = ${normalized}`)
        .orderBy(desc(users.id));
      if (user) return user;
      return this.fallbackMem.getUserByEmail(normalized);
    } catch {
      return this.fallbackMem.getUserByEmail(normalized);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));
      return user || undefined;
    } catch {
      return this.fallbackMem.getUser(id);
    }
  }

  async getUserByStripeSessionId(sessionId: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.stripeSessionId, sessionId));
      return user || undefined;
    } catch {
      return this.fallbackMem.getUserByStripeSessionId(sessionId);
    }
  }

  async addMarketingEmail(data: InsertMarketingEmail): Promise<MarketingEmail> {
    try {
      const [marketingEmail] = await db
        .insert(marketingEmails)
        .values(data)
        .returning();
      return marketingEmail;
    } catch (err) {
      console.warn("Fallback addMarketingEmail:", err);
      return this.fallbackMem.addMarketingEmail(data);
    }
  }

  async logEmail(data: InsertEmailLog): Promise<EmailLog> {
    try {
      const [emailLog] = await db
        .insert(emailLogs)
        .values(data)
        .returning();
      return emailLog;
    } catch (err) {
      console.warn("Fallback logEmail:", err);
      return this.fallbackMem.logEmail(data);
    }
  }

  async getAllEmailLogs(): Promise<EmailLog[]> {
    try {
      return await db.select().from(emailLogs);
    } catch {
      return this.fallbackMem.getAllEmailLogs();
    }
  }

  async getMarketingEmails(): Promise<MarketingEmail[]> {
    try {
      return await db.select().from(marketingEmails);
    } catch {
      return this.fallbackMem.getMarketingEmails();
    }
  }

  async getResetRunByUserId(userId: number): Promise<ResetRun | undefined> {
    try {
      const [run] = await db
        .select()
        .from(resetRuns)
        .where(eq(resetRuns.userId, userId));
      return run || undefined;
    } catch (err) {
      console.warn("getResetRunByUserId fallback:", err);
      return this.fallbackMem.getResetRunByUserId(userId);
    }
  }

  async getResetRunAndItemsByUserId(userId: number): Promise<{ resetRun: ResetRun; items: ResetItem[] } | undefined> {
    try {
      const [run] = await db
        .select()
        .from(resetRuns)
        .where(eq(resetRuns.userId, userId));
      if (!run) return undefined;

      const items = await db
        .select()
        .from(resetItems)
        .where(eq(resetItems.resetRunId, run.id))
        .orderBy(asc(resetItems.sequence));

      return { resetRun: run, items };
    } catch (err) {
      console.warn("getResetRunAndItemsByUserId fallback:", err);
      return this.fallbackMem.getResetRunAndItemsByUserId(userId);
    }
  }

  async createResetRun(
    insertRun: Omit<InsertResetRun, "id" | "createdAt" | "updatedAt">,
    insertItems: Omit<InsertResetItem, "id" | "resetRunId" | "createdAt" | "updatedAt">[]
  ): Promise<{ resetRun: ResetRun; items: ResetItem[] } | { existingRun: ResetRun }> {
    try {
      return await db.transaction(async (tx) => {
        // Lock the user row to serialize creation attempts per user
        await tx.select().from(users).where(eq(users.id, insertRun.userId)).for('update');

        // Check if run already exists
        const [existingRun] = await tx.select().from(resetRuns).where(eq(resetRuns.userId, insertRun.userId));
        
        if (existingRun) {
          return { existingRun };
        }

        const [run] = await tx
          .insert(resetRuns)
          .values(insertRun)
          .returning();

        const itemsToInsert = insertItems.map(item => ({
          ...item,
          resetRunId: run.id
        }));

        const items = await tx
          .insert(resetItems)
          .values(itemsToInsert)
          .returning();

        return { resetRun: run, items };
      });
    } catch (err) {
      console.warn("createResetRun fallback:", err);
      return this.fallbackMem.createResetRun(insertRun, insertItems);
    }
  }

  async startResetRunForUser(userId: number): Promise<StartResetResult> {
    try {
      return await db.transaction(async (tx) => {
        // 1. Fetch and lock the user's reset run
        const [run] = await tx
          .select()
          .from(resetRuns)
          .where(eq(resetRuns.userId, userId))
          .for('update');

        if (!run) {
          return { type: "not_found" };
        }

        const items = await tx
          .select()
          .from(resetItems)
          .where(eq(resetItems.resetRunId, run.id))
          .orderBy(asc(resetItems.sequence));

        if (run.status === 'active') {
          return { type: "already_active", resetRun: run, items };
        }

        if (run.status !== 'ready') {
          return { type: "invalid_state" };
        }

        const firstScheduledItem = items.find(i => i.status === 'scheduled');
        if (!firstScheduledItem) {
          return { type: "corrupt_state" };
        }

        const now = new Date();

        const [updatedRun] = await tx
          .update(resetRuns)
          .set({
            status: 'active',
            phase: firstScheduledItem.phase,
            startedAt: now,
            updatedAt: now
          })
          .where(eq(resetRuns.id, run.id))
          .returning();

        const [updatedItem] = await tx
          .update(resetItems)
          .set({
            status: 'active',
            updatedAt: now
          })
          .where(eq(resetItems.id, firstScheduledItem.id))
          .returning();

        const updatedItems = items.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        );

        return { 
          type: "success", 
          resetRun: updatedRun, 
          items: updatedItems 
        };
      });
    } catch (err) {
      console.warn("startResetRunForUser fallback:", err);
      return this.fallbackMem.startResetRunForUser(userId);
    }
  }

  async advanceResetItemForUser(userId: number, itemId: number, action: "complete" | "skip"): Promise<AdvanceResetResult> {
    try {
      return await db.transaction(async (tx) => {
        const [run] = await tx
          .select()
          .from(resetRuns)
          .where(eq(resetRuns.userId, userId))
          .for('update');

        if (!run) {
          return { type: "not_found" };
        }

        const items = await tx
          .select()
          .from(resetItems)
          .where(eq(resetItems.resetRunId, run.id))
          .orderBy(asc(resetItems.sequence));

        const targetItem = items.find(i => i.id === itemId);
        if (!targetItem) {
          return { type: "item_not_found" };
        }

        if (action === "complete" && targetItem.status === "completed") {
          if (run.status === "completed") {
            const activeItemsCount = items.filter(i => i.status === 'active').length;
            const scheduledItemsCount = items.filter(i => i.status === 'scheduled').length;
            
            const [nextMorningRef] = await tx.select().from(resetEntries)
              .where(and(eq(resetEntries.resetRunId, run.id), eq(resetEntries.kind, 'next_morning_reflection')));
              
            if (activeItemsCount > 0 || scheduledItemsCount > 0 || !nextMorningRef) {
              return { type: "corrupt_state" };
            }
          }
          return { type: "already_done", resetRun: run, items };
        }
        if (action === "skip" && targetItem.status === "skipped") {
          if (run.status === "completed") {
            const activeItemsCount = items.filter(i => i.status === 'active').length;
            const scheduledItemsCount = items.filter(i => i.status === 'scheduled').length;
            
            const [nextMorningRef] = await tx.select().from(resetEntries)
              .where(and(eq(resetEntries.resetRunId, run.id), eq(resetEntries.kind, 'next_morning_reflection')));
              
            if (activeItemsCount > 0 || scheduledItemsCount > 0 || !nextMorningRef) {
              return { type: "corrupt_state" };
            }
          }
          return { type: "already_done", resetRun: run, items };
        }

        if (action === "complete" && targetItem.status === "skipped") return { type: "conflict" };
        if (action === "skip" && targetItem.status === "completed") return { type: "conflict" };
        if (run.status !== 'active' && run.status !== 'next_morning') return { type: "conflict" };
        if (run.status === 'next_morning' && action === 'skip') return { type: "conflict" };
        if (targetItem.status !== 'active') return { type: "conflict" };

        const activeItems = items.filter(i => i.status === 'active');
        if (activeItems.length !== 1) {
          return { type: "corrupt_state" };
        }

        const nextScheduledItem = items.find(i => i.status === 'scheduled' && i.sequence > targetItem.sequence);
        
        if (run.status === 'next_morning') {
          if (targetItem.phase !== 'next_morning') return { type: "corrupt_state" };
          if (nextScheduledItem) return { type: "corrupt_state" };
        } else {
          if (!nextScheduledItem) return { type: "corrupt_state" };
        }

        const now = new Date();

        const itemUpdatePayload: any = { 
          status: action === "complete" ? "completed" : "skipped", 
          updatedAt: now 
        };
        
        if (action === "complete") {
          itemUpdatePayload.completedAt = now;
        } else {
          itemUpdatePayload.skippedAt = now;
        }

        const [updatedTargetItem] = await tx
          .update(resetItems)
          .set(itemUpdatePayload)
          .where(eq(resetItems.id, targetItem.id))
          .returning();

        let updatedRun;
        let updatedNextItem = null;

        if (run.status === 'next_morning') {
          const [nextMorningRef] = await tx.select().from(resetEntries)
            .where(and(eq(resetEntries.resetRunId, run.id), eq(resetEntries.kind, 'next_morning_reflection')));
            
          if (!nextMorningRef) return { type: "reflection_required" };

          const [r] = await tx
            .update(resetRuns)
            .set({
              status: 'completed',
              phase: 'next_morning',
              completedAt: now,
              updatedAt: now
            })
            .where(eq(resetRuns.id, run.id))
            .returning();
          updatedRun = r;
        } else if (nextScheduledItem!.phase === 'next_morning') {
          const [r] = await tx
            .update(resetRuns)
            .set({
              status: 'sleep',
              phase: 'sleep',
              sleepStartedAt: now,
              updatedAt: now
            })
            .where(eq(resetRuns.id, run.id))
            .returning();
          updatedRun = r;
        } else {
          const [r] = await tx
            .update(resetRuns)
            .set({
              phase: nextScheduledItem!.phase,
              updatedAt: now
            })
            .where(eq(resetRuns.id, run.id))
            .returning();
          updatedRun = r;

          const [i] = await tx
            .update(resetItems)
            .set({
              status: 'active',
              updatedAt: now
            })
            .where(eq(resetItems.id, nextScheduledItem!.id))
            .returning();
          updatedNextItem = i;
        }

        const updatedItems = items.map(item => {
          if (item.id === updatedTargetItem.id) return updatedTargetItem;
          if (updatedNextItem && item.id === updatedNextItem.id) return updatedNextItem;
          return item;
        });

        return { type: "success", resetRun: updatedRun, items: updatedItems };
      });
    } catch (err) {
      console.warn("advanceResetItemForUser fallback:", err);
      return this.fallbackMem.advanceResetItemForUser(userId, itemId, action);
    }
  }

  async startNextMorningForUser(userId: number): Promise<StartNextMorningResult> {
    try {
      return await db.transaction(async (tx) => {
        const [run] = await tx
          .select()
          .from(resetRuns)
          .where(eq(resetRuns.userId, userId))
          .for('update');

        if (!run) {
          return { type: "not_found" };
        }

        const items = await tx
          .select()
          .from(resetItems)
          .where(eq(resetItems.resetRunId, run.id))
          .orderBy(asc(resetItems.sequence));

        if (run.status === "next_morning") {
          const activeItems = items.filter(i => i.status === 'active');
          if (activeItems.length === 1 && activeItems[0].phase === 'next_morning') {
            return { type: "already_active", resetRun: run, items };
          }
          return { type: "corrupt_state" };
        }

        if (run.status !== "sleep") {
          return { type: "invalid_state" };
        }

        const activeItems = items.filter(i => i.status === 'active');
        if (activeItems.length > 0) {
          return { type: "corrupt_state" };
        }

        const firstScheduledItem = items.find(i => i.status === 'scheduled');
        if (!firstScheduledItem || firstScheduledItem.phase !== "next_morning") {
          return { type: "corrupt_state" };
        }

        const now = new Date();

        const [updatedRun] = await tx
          .update(resetRuns)
          .set({ 
            status: 'next_morning', 
            phase: 'next_morning', 
            nextMorningStartedAt: now, 
            updatedAt: now 
          })
          .where(eq(resetRuns.id, run.id))
          .returning();

        const [updatedItem] = await tx
          .update(resetItems)
          .set({ status: 'active', updatedAt: now })
          .where(eq(resetItems.id, firstScheduledItem.id))
          .returning();
        
        const updatedItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);

        return { type: "success", resetRun: updatedRun, items: updatedItems };
      });
    } catch (err) {
      console.warn("startNextMorningForUser fallback:", err);
      return this.fallbackMem.startNextMorningForUser(userId);
    }
  }

  async saveResetEntryForUser(userId: number, kind: string, content: string): Promise<SaveEntryResult> {
    try {
      return await db.transaction(async (tx) => {
        const [run] = await tx
          .select()
          .from(resetRuns)
          .where(eq(resetRuns.userId, userId))
          .for('update');

        if (!run) {
          return { type: "not_found" };
        }

        if (run.status === 'abandoned') {
          return { type: "invalid_lifecycle" };
        }

        const [existingEntry] = await tx
          .select()
          .from(resetEntries)
          .where(and(eq(resetEntries.resetRunId, run.id), eq(resetEntries.kind, kind)));

        const now = new Date();

        if (existingEntry) {
          if (existingEntry.content === content) {
            return { type: "success", entry: existingEntry };
          }
          const [updatedEntry] = await tx
            .update(resetEntries)
            .set({ content })
            .where(eq(resetEntries.id, existingEntry.id))
            .returning();
          return { type: "success", entry: updatedEntry };
        } else {
          const [newEntry] = await tx
            .insert(resetEntries)
            .values({
              resetRunId: run.id,
              kind,
              content,
              createdAt: now
            })
            .returning();
          return { type: "success", entry: newEntry };
        }
      });
    } catch (err) {
      console.warn("saveResetEntryForUser fallback:", err);
      return this.fallbackMem.saveResetEntryForUser(userId, kind, content);
    }
  }

  async getResetEntriesForUser(userId: number): Promise<{ type: "not_found" } | { type: "success", entries: ResetEntry[] }> {
    try {
      const run = await db.query.resetRuns.findFirst({
        where: eq(resetRuns.userId, userId)
      });

      if (!run) return { type: "not_found" };

      const entries = await db.select()
        .from(resetEntries)
        .where(eq(resetEntries.resetRunId, run.id))
        .orderBy(asc(resetEntries.createdAt), asc(resetEntries.id));

      return { type: "success", entries };
    } catch (err) {
      console.warn("getResetEntriesForUser fallback:", err);
      return this.fallbackMem.getResetEntriesForUser(userId);
    }
  }

  async updateResetFoodPreferenceForUser(userId: number, foodPreference: string): Promise<{ type: "not_found" } | { type: "success", resetRun: ResetRun }> {
    try {
      const [run] = await db
        .select()
        .from(resetRuns)
        .where(eq(resetRuns.userId, userId));

      if (!run) return { type: "not_found" };

      const [updatedRun] = await db
        .update(resetRuns)
        .set({ foodPreference, updatedAt: new Date() })
        .where(eq(resetRuns.id, run.id))
        .returning();

      return { type: "success", resetRun: updatedRun };
    } catch (err) {
      console.warn("updateResetFoodPreferenceForUser fallback:", err);
      return this.fallbackMem.updateResetFoodPreferenceForUser(userId, foodPreference);
    }
  }

  async delayResetItemForUser(userId: number, itemId: number, delayMinutes: number, expectedScheduleRevision: number): Promise<DelayResetResult> {
    try {
      return await db.transaction(async (tx) => {
        const [run] = await tx.select().from(resetRuns).where(eq(resetRuns.userId, userId)).for('update');
        if (!run) return { type: "not_found" };
        if (run.status !== 'active') return { type: "invalid_lifecycle" };
        if (run.scheduleRevision !== expectedScheduleRevision) return { type: "stale_revision" };
        if (!run.targetBedtimeAt) return { type: "corrupt_state" };

        const items = await tx.select().from(resetItems).where(eq(resetItems.resetRunId, run.id)).orderBy(asc(resetItems.sequence));
        
        const targetItem = items.find(i => i.id === itemId);
        if (!targetItem) return { type: "item_not_found" };
        if (targetItem.status !== 'active') return { type: "conflict" };

        const activeItems = items.filter(i => i.status === 'active');
        if (activeItems.length !== 1) return { type: "corrupt_state" };

        const rescheduleResult = computeDelayedSchedule(items, targetItem.id, delayMinutes, run.targetBedtimeAt);
        if (rescheduleResult.type === 'schedule_conflict') return { type: "schedule_conflict" };

        const now = new Date();
        
        const updatedItemsMap = new Map<number, ResetItem>();
        for (const item of items) updatedItemsMap.set(item.id, { ...item });

        for (const change of rescheduleResult.changes) {
          const [updated] = await tx.update(resetItems)
            .set({ scheduledAt: change.newScheduledAt, updatedAt: now })
            .where(eq(resetItems.id, change.itemId))
            .returning();
          updatedItemsMap.set(updated.id, updated);
        }

        const [updatedRun] = await tx.update(resetRuns)
          .set({ scheduleRevision: run.scheduleRevision + 1, updatedAt: now })
          .where(eq(resetRuns.id, run.id))
          .returning();

        return { type: "success", resetRun: updatedRun, items: Array.from(updatedItemsMap.values()).sort((a,b) => a.sequence - b.sequence) };
      });
    } catch (err) {
      console.warn("delayResetItemForUser fallback:", err);
      return this.fallbackMem.delayResetItemForUser(userId, itemId, delayMinutes, expectedScheduleRevision);
    }
  }

  async upsertAgentLead(data: Partial<InsertAgentLead> & { email: string }): Promise<AgentLead> {
    const normalizedEmail = data.email.trim().toLowerCase();
    try {
      const existing = await this.getAgentLeadByEmail(normalizedEmail);
      const now = new Date();
      if (existing) {
        const updatePayload: Partial<InsertAgentLead> & { updatedAt: Date } = {
          updatedAt: now,
        };
        if (data.firstName !== undefined && data.firstName) updatePayload.firstName = data.firstName;
        if (data.source !== undefined) updatePayload.source = data.source;
        if (data.archetypeId !== undefined) updatePayload.archetypeId = data.archetypeId;
        if (data.wakeTime !== undefined) updatePayload.wakeTime = data.wakeTime;
        if (data.foodPreference !== undefined) updatePayload.foodPreference = data.foodPreference;
        if (data.pastBlocker !== undefined) updatePayload.pastBlocker = data.pastBlocker;
        if (data.nurtureStage !== undefined) updatePayload.nurtureStage = data.nurtureStage;
        if (data.nextEmailAt !== undefined) updatePayload.nextEmailAt = data.nextEmailAt;
        if (data.hasPurchased !== undefined) updatePayload.hasPurchased = data.hasPurchased;
        if (data.unsubscribed !== undefined) updatePayload.unsubscribed = data.unsubscribed;

        const [updated] = await db
          .update(agentLeads)
          .set(updatePayload)
          .where(eq(agentLeads.id, existing.id))
          .returning();
        return updated;
      }

      const [inserted] = await db
        .insert(agentLeads)
        .values({
          email: normalizedEmail,
          firstName: data.firstName ?? null,
          source: data.source ?? "quiz",
          archetypeId: data.archetypeId ?? "cortisol_spiked",
          wakeTime: data.wakeTime ?? "07:00",
          foodPreference: data.foodPreference ?? "omni",
          pastBlocker: data.pastBlocker ?? "ran_late",
          nurtureStage: data.nurtureStage ?? 0,
          nextEmailAt: data.nextEmailAt ?? now,
          hasPurchased: data.hasPurchased ?? false,
          unsubscribed: data.unsubscribed ?? false,
        })
        .returning();
      return inserted;
    } catch (err) {
      console.warn("upsertAgentLead fallback:", err);
      return this.fallbackMem.upsertAgentLead({ ...data, email: normalizedEmail });
    }
  }

  async getAgentLeadByEmail(email: string): Promise<AgentLead | undefined> {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const [lead] = await db
        .select()
        .from(agentLeads)
        .where(sql`LOWER(${agentLeads.email}) = ${normalizedEmail}`);
      if (lead) return lead;
      return this.fallbackMem.getAgentLeadByEmail(normalizedEmail);
    } catch {
      return this.fallbackMem.getAgentLeadByEmail(normalizedEmail);
    }
  }

  async getAllAgentLeads(): Promise<AgentLead[]> {
    try {
      const rows = await db
        .select()
        .from(agentLeads)
        .orderBy(desc(agentLeads.updatedAt), desc(agentLeads.id));
      if (rows.length > 0) return rows;
      return this.fallbackMem.getAllAgentLeads();
    } catch {
      return this.fallbackMem.getAllAgentLeads();
    }
  }

  async getDueAgentLeads(now: Date = new Date()): Promise<AgentLead[]> {
    try {
      const rows = await db
        .select()
        .from(agentLeads)
        .where(
          and(
            eq(agentLeads.hasPurchased, false),
            eq(agentLeads.unsubscribed, false),
            lt(agentLeads.nurtureStage, 4),
            lte(agentLeads.nextEmailAt, now)
          )
        )
        .orderBy(asc(agentLeads.nextEmailAt));
      return rows;
    } catch {
      return this.fallbackMem.getDueAgentLeads(now);
    }
  }

  async updateAgentLeadStage(email: string, nurtureStage: number, nextEmailAt: Date | null): Promise<AgentLead | undefined> {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const [updated] = await db
        .update(agentLeads)
        .set({
          nurtureStage,
          nextEmailAt,
          updatedAt: new Date(),
        })
        .where(sql`LOWER(${agentLeads.email}) = ${normalizedEmail}`)
        .returning();
      if (updated) return updated;
      return this.fallbackMem.updateAgentLeadStage(normalizedEmail, nurtureStage, nextEmailAt);
    } catch {
      return this.fallbackMem.updateAgentLeadStage(normalizedEmail, nurtureStage, nextEmailAt);
    }
  }

  async markAgentLeadPurchased(email: string): Promise<AgentLead | undefined> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return undefined;
    try {
      const [updated] = await db
        .update(agentLeads)
        .set({
          hasPurchased: true,
          nextEmailAt: null,
          updatedAt: new Date(),
        })
        .where(sql`LOWER(${agentLeads.email}) = ${normalizedEmail}`)
        .returning();
      if (updated) return updated;
      return this.fallbackMem.markAgentLeadPurchased(normalizedEmail);
    } catch {
      return this.fallbackMem.markAgentLeadPurchased(normalizedEmail);
    }
  }

  async unsubscribeAgentLead(email: string): Promise<AgentLead | undefined> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return undefined;
    try {
      const [updated] = await db
        .update(agentLeads)
        .set({
          unsubscribed: true,
          nextEmailAt: null,
          updatedAt: new Date(),
        })
        .where(sql`LOWER(${agentLeads.email}) = ${normalizedEmail}`)
        .returning();
      if (updated) return updated;
      return this.fallbackMem.unsubscribeAgentLead(normalizedEmail);
    } catch {
      return this.fallbackMem.unsubscribeAgentLead(normalizedEmail);
    }
  }

  async createAgentInteraction(data: InsertAgentInteraction): Promise<AgentInteraction> {
    try {
      const [interaction] = await db
        .insert(agentInteractions)
        .values(data)
        .returning();
      return interaction;
    } catch {
      return this.fallbackMem.createAgentInteraction(data);
    }
  }

  async getRecentAgentInteractions(limit: number = 50): Promise<AgentInteraction[]> {
    try {
      const rows = await db
        .select()
        .from(agentInteractions)
        .orderBy(desc(agentInteractions.createdAt), desc(agentInteractions.id))
        .limit(limit);
      if (rows.length > 0) return rows;
      return this.fallbackMem.getRecentAgentInteractions(limit);
    } catch {
      return this.fallbackMem.getRecentAgentInteractions(limit);
    }
  }

  async getAgentVideos(): Promise<AgentVideo[]> {
    try {
      const rows = await db
        .select()
        .from(agentVideos)
        .orderBy(desc(agentVideos.createdAt), desc(agentVideos.id));
      if (rows.length > 0) return rows;
      return this.fallbackMem.getAgentVideos();
    } catch {
      return this.fallbackMem.getAgentVideos();
    }
  }

  async getAgentVideoById(id: number): Promise<AgentVideo | undefined> {
    try {
      const [row] = await db
        .select()
        .from(agentVideos)
        .where(eq(agentVideos.id, id));
      if (row) return row;
      return this.fallbackMem.getAgentVideoById(id);
    } catch {
      return this.fallbackMem.getAgentVideoById(id);
    }
  }

  async createAgentVideo(data: InsertAgentVideo): Promise<AgentVideo> {
    try {
      const [created] = await db
        .insert(agentVideos)
        .values(data)
        .returning();
      return created;
    } catch {
      return this.fallbackMem.createAgentVideo(data);
    }
  }

  async updateAgentVideo(id: number, data: Partial<InsertAgentVideo>): Promise<AgentVideo | undefined> {
    try {
      const [updated] = await db
        .update(agentVideos)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(agentVideos.id, id))
        .returning();
      if (updated) return updated;
      return this.fallbackMem.updateAgentVideo(id, data);
    } catch {
      return this.fallbackMem.updateAgentVideo(id, data);
    }
  }
}

export class MemStorage implements IStorage {
  sessionStore: session.Store;
  private subscribersList: Subscriber[] = [];
  private usersList: User[] = [];
  private marketingList: MarketingEmail[] = [];
  private emailLogsList: EmailLog[] = [];
  private runsList: ResetRun[] = [];
  private itemsList: ResetItem[] = [];
  private entriesList: ResetEntry[] = [];
  private agentLeadsList: AgentLead[] = [];
  private agentInteractionsList: AgentInteraction[] = [];
  private agentVideosList: AgentVideo[] = [];
  private nextId = 1;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const sub: Subscriber = {
      id: this.nextId++,
      email: insertSubscriber.email,
      createdAt: new Date(),
    };
    this.subscribersList.push(sub);
    return sub;
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    return this.subscribersList.find((s) => s.email === email);
  }

  async getAllSubscribers(): Promise<Subscriber[]> {
    return [...this.subscribersList];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextId++,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email ?? null,
      firstName: insertUser.firstName ?? null,
      stripeSessionId: insertUser.stripeSessionId ?? null,
      createdAt: new Date(),
    };
    this.usersList.push(user);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.usersList.find((u) => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return undefined;
    for (let i = this.usersList.length - 1; i >= 0; i--) {
      const u = this.usersList[i];
      if (u.email && u.email.trim().toLowerCase() === normalized) {
        return u;
      }
    }
    return undefined;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.usersList.find((u) => u.id === id);
  }

  async getUserByStripeSessionId(sessionId: string): Promise<User | undefined> {
    return this.usersList.find((u) => u.stripeSessionId === sessionId);
  }

  async addMarketingEmail(data: InsertMarketingEmail): Promise<MarketingEmail> {
    const entry: MarketingEmail = {
      id: this.nextId++,
      email: data.email,
      firstName: data.firstName ?? null,
      optedInAt: new Date(),
      isActive: "true",
    };
    this.marketingList.push(entry);
    return entry;
  }

  async logEmail(data: InsertEmailLog): Promise<EmailLog> {
    const entry: EmailLog = {
      id: this.nextId++,
      userId: data.userId ?? 0,
      email: data.email,
      emailType: data.emailType,
      subject: data.subject,
      sentAt: new Date(),
      status: data.status ?? "sent",
    };
    this.emailLogsList.push(entry);
    return entry;
  }

  async getAllEmailLogs(): Promise<EmailLog[]> {
    return [...this.emailLogsList];
  }

  async getMarketingEmails(): Promise<MarketingEmail[]> {
    return [...this.marketingList];
  }

  async getResetRunByUserId(userId: number): Promise<ResetRun | undefined> {
    return this.runsList.find((r) => r.userId === userId);
  }

  async getResetRunAndItemsByUserId(
    userId: number
  ): Promise<{ resetRun: ResetRun; items: ResetItem[] } | undefined> {
    const resetRun = this.runsList.find((r) => r.userId === userId);
    if (!resetRun) return undefined;
    const items = this.itemsList
      .filter((i) => i.resetRunId === resetRun.id)
      .sort((a, b) => a.sequence - b.sequence);
    return { resetRun, items };
  }

  async createResetRun(
    resetRun: Omit<InsertResetRun, "id" | "createdAt" | "updatedAt">,
    items: Omit<InsertResetItem, "id" | "resetRunId" | "createdAt" | "updatedAt">[]
  ): Promise<{ resetRun: ResetRun; items: ResetItem[] } | { existingRun: ResetRun }> {
    const existing = this.runsList.find((r) => r.userId === resetRun.userId);
    if (existing) return { existingRun: existing };
    const now = new Date();
    const createdRun: ResetRun = {
      id: this.nextId++,
      userId: resetRun.userId,
      catalogVersion: resetRun.catalogVersion ?? "v1",
      status: resetRun.status ?? "ready",
      phase: resetRun.phase ?? null,
      scheduleRevision: resetRun.scheduleRevision ?? 0,
      timezone: resetRun.timezone,
      startAt: resetRun.startAt ?? null,
      targetBedtimeAt: resetRun.targetBedtimeAt ?? null,
      targetNextMorningAt: resetRun.targetNextMorningAt ?? null,
      startedAt: null,
      sleepStartedAt: null,
      nextMorningStartedAt: null,
      completedAt: null,
      resetGoal: resetRun.resetGoal ?? null,
      foodPreference: resetRun.foodPreference ?? null,
      movementAccess: resetRun.movementAccess ?? null,
      blockedTimesJson: resetRun.blockedTimesJson ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.runsList.push(createdRun);
    const createdItems: ResetItem[] = items.map((item) => {
      const it: ResetItem = {
        id: this.nextId++,
        resetRunId: createdRun.id,
        activityKey: item.activityKey,
        variantKey: item.variantKey ?? null,
        phase: item.phase,
        sequence: item.sequence,
        originalScheduledAt: item.originalScheduledAt ?? null,
        scheduledAt: item.scheduledAt ?? null,
        durationMinutes: item.durationMinutes ?? null,
        status: item.status ?? "scheduled",
        completedAt: item.completedAt ?? null,
        skippedAt: item.skippedAt ?? null,
        createdAt: now,
        updatedAt: now,
      };
      this.itemsList.push(it);
      return it;
    });
    return { resetRun: createdRun, items: createdItems };
  }

  async startResetRunForUser(userId: number): Promise<StartResetResult> {
    const data = await this.getResetRunAndItemsByUserId(userId);
    if (!data) return { type: "not_found" };
    if (data.resetRun.status === "active") {
      return { type: "already_active", resetRun: data.resetRun, items: data.items };
    }
    if (data.resetRun.status !== "ready") return { type: "invalid_state" };
    const first = data.items[0];
    if (!first) return { type: "corrupt_state" };
    first.status = "active";
    data.resetRun.status = "active";
    data.resetRun.phase = first.phase;
    return { type: "success", resetRun: data.resetRun, items: data.items };
  }

  async advanceResetItemForUser(
    userId: number,
    itemId: number,
    action: "complete" | "skip"
  ): Promise<AdvanceResetResult> {
    const data = await this.getResetRunAndItemsByUserId(userId);
    if (!data) return { type: "not_found" };
    const item = data.items.find((i) => i.id === itemId);
    if (!item) return { type: "item_not_found" };
    const now = new Date();
    item.status = action === "complete" ? "completed" : "skipped";
    if (action === "complete") {
      item.completedAt = now;
    } else {
      item.skippedAt = now;
    }
    item.updatedAt = now;

    if (data.resetRun.status === "next_morning") {
      data.resetRun.status = "completed";
      data.resetRun.phase = "next_morning";
      data.resetRun.completedAt = now;
      data.resetRun.updatedAt = now;
      return { type: "success", resetRun: data.resetRun, items: data.items };
    }

    const next = data.items.find((i) => i.status === "scheduled" && i.sequence > item.sequence);
    if (!next) {
      data.resetRun.status = "completed";
      data.resetRun.phase = "next_morning";
      data.resetRun.completedAt = now;
      data.resetRun.updatedAt = now;
    } else if (next.phase === "next_morning") {
      data.resetRun.status = "sleep";
      data.resetRun.phase = "sleep";
      data.resetRun.sleepStartedAt = now;
      data.resetRun.updatedAt = now;
    } else {
      next.status = "active";
      next.updatedAt = now;
      data.resetRun.phase = next.phase;
      data.resetRun.updatedAt = now;
    }
    return { type: "success", resetRun: data.resetRun, items: data.items };
  }

  async delayResetItemForUser(
    userId: number,
    itemId: number,
    delayMinutes: number,
    expectedScheduleRevision: number
  ): Promise<DelayResetResult> {
    const data = await this.getResetRunAndItemsByUserId(userId);
    if (!data) return { type: "not_found" };
    if (data.resetRun.scheduleRevision !== expectedScheduleRevision) {
      return { type: "stale_revision" };
    }
    if (!data.resetRun.targetBedtimeAt) return { type: "corrupt_state" };
    const res = computeDelayedSchedule(
      data.items,
      itemId,
      delayMinutes,
      data.resetRun.targetBedtimeAt
    );
    if (res.type === "schedule_conflict") return { type: "schedule_conflict" };
    for (const ch of res.changes) {
      const it = data.items.find((i) => i.id === ch.itemId);
      if (it) it.scheduledAt = ch.newScheduledAt;
    }
    data.resetRun.scheduleRevision += 1;
    return { type: "success", resetRun: data.resetRun, items: data.items };
  }

  async startNextMorningForUser(userId: number): Promise<StartNextMorningResult> {
    const data = await this.getResetRunAndItemsByUserId(userId);
    if (!data) return { type: "not_found" };
    const now = new Date();
    data.resetRun.status = "next_morning";
    data.resetRun.phase = "next_morning";
    data.resetRun.nextMorningStartedAt = now;
    data.resetRun.updatedAt = now;
    const nextMorningItem = data.items.find((i) => i.phase === "next_morning");
    if (nextMorningItem && nextMorningItem.status === "scheduled") {
      nextMorningItem.status = "active";
      nextMorningItem.updatedAt = now;
    }
    return { type: "success", resetRun: data.resetRun, items: data.items };
  }

  async saveResetEntryForUser(
    userId: number,
    kind: string,
    content: string
  ): Promise<SaveEntryResult> {
    const run = await this.getResetRunByUserId(userId);
    if (!run) return { type: "not_found" };
    const existing = this.entriesList.find(
      (e) => e.resetRunId === run.id && e.kind === kind
    );
    if (existing) {
      existing.content = content;
      return { type: "success", entry: existing };
    }
    const newEntry: ResetEntry = {
      id: this.nextId++,
      resetRunId: run.id,
      resetItemId: null,
      kind,
      content,
      createdAt: new Date(),
    };
    this.entriesList.push(newEntry);
    return { type: "success", entry: newEntry };
  }

  async getResetEntriesForUser(
    userId: number
  ): Promise<{ type: "not_found" } | { type: "success"; entries: ResetEntry[] }> {
    const run = await this.getResetRunByUserId(userId);
    if (!run) return { type: "not_found" };
    const entries = this.entriesList.filter((e) => e.resetRunId === run.id);
    return { type: "success", entries };
  }

  async updateResetFoodPreferenceForUser(
    userId: number,
    foodPreference: string
  ): Promise<{ type: "not_found" } | { type: "success"; resetRun: ResetRun }> {
    const run = await this.getResetRunByUserId(userId);
    if (!run) return { type: "not_found" };
    run.foodPreference = foodPreference;
    return { type: "success", resetRun: run };
  }

  async upsertAgentLead(data: Partial<InsertAgentLead> & { email: string }): Promise<AgentLead> {
    const normalizedEmail = data.email.trim().toLowerCase();
    const now = new Date();
    const existing = this.agentLeadsList.find((l) => l.email.toLowerCase() === normalizedEmail);
    if (existing) {
      if (data.firstName !== undefined && data.firstName) existing.firstName = data.firstName;
      if (data.source !== undefined && data.source) existing.source = data.source;
      if (data.archetypeId !== undefined && data.archetypeId) existing.archetypeId = data.archetypeId;
      if (data.wakeTime !== undefined && data.wakeTime) existing.wakeTime = data.wakeTime;
      if (data.foodPreference !== undefined && data.foodPreference) existing.foodPreference = data.foodPreference;
      if (data.pastBlocker !== undefined && data.pastBlocker) existing.pastBlocker = data.pastBlocker;
      if (data.nurtureStage !== undefined && data.nurtureStage !== null) existing.nurtureStage = data.nurtureStage;
      if (data.nextEmailAt !== undefined) existing.nextEmailAt = data.nextEmailAt ?? null;
      if (data.hasPurchased !== undefined && data.hasPurchased !== null) existing.hasPurchased = data.hasPurchased;
      if (data.unsubscribed !== undefined && data.unsubscribed !== null) existing.unsubscribed = data.unsubscribed;
      existing.updatedAt = now;
      return existing;
    }

    const created: AgentLead = {
      id: this.nextId++,
      email: normalizedEmail,
      firstName: data.firstName ?? null,
      source: data.source ?? "quiz",
      archetypeId: data.archetypeId ?? "cortisol_spiked",
      wakeTime: data.wakeTime ?? "07:00",
      foodPreference: data.foodPreference ?? "omni",
      pastBlocker: data.pastBlocker ?? "ran_late",
      nurtureStage: data.nurtureStage ?? 0,
      nextEmailAt: data.nextEmailAt !== undefined ? (data.nextEmailAt ?? null) : now,
      hasPurchased: data.hasPurchased ?? false,
      unsubscribed: data.unsubscribed ?? false,
      createdAt: now,
      updatedAt: now,
    };
    this.agentLeadsList.push(created);
    return created;
  }

  async getAgentLeadByEmail(email: string): Promise<AgentLead | undefined> {
    const normalizedEmail = email.trim().toLowerCase();
    return this.agentLeadsList.find((l) => l.email.toLowerCase() === normalizedEmail);
  }

  async getAllAgentLeads(): Promise<AgentLead[]> {
    return [...this.agentLeadsList].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getDueAgentLeads(now: Date = new Date()): Promise<AgentLead[]> {
    return this.agentLeadsList.filter(
      (l) =>
        !l.hasPurchased &&
        !l.unsubscribed &&
        l.nurtureStage < 4 &&
        l.nextEmailAt !== null &&
        l.nextEmailAt.getTime() <= now.getTime()
    );
  }

  async updateAgentLeadStage(email: string, nurtureStage: number, nextEmailAt: Date | null): Promise<AgentLead | undefined> {
    const lead = await this.getAgentLeadByEmail(email);
    if (!lead) return undefined;
    lead.nurtureStage = nurtureStage;
    lead.nextEmailAt = nextEmailAt;
    lead.updatedAt = new Date();
    return lead;
  }

  async markAgentLeadPurchased(email: string): Promise<AgentLead | undefined> {
    const lead = await this.getAgentLeadByEmail(email);
    if (!lead) return undefined;
    lead.hasPurchased = true;
    lead.nextEmailAt = null;
    lead.updatedAt = new Date();
    return lead;
  }

  async unsubscribeAgentLead(email: string): Promise<AgentLead | undefined> {
    const lead = await this.getAgentLeadByEmail(email);
    if (!lead) return undefined;
    lead.unsubscribed = true;
    lead.nextEmailAt = null;
    lead.updatedAt = new Date();
    return lead;
  }

  async createAgentInteraction(data: InsertAgentInteraction): Promise<AgentInteraction> {
    const created: AgentInteraction = {
      id: this.nextId++,
      channel: data.channel,
      senderIdentifier: data.senderIdentifier,
      inboundMessage: data.inboundMessage ?? null,
      agentReply: data.agentReply,
      metadata: data.metadata ?? null,
      createdAt: new Date(),
    };
    this.agentInteractionsList.unshift(created);
    return created;
  }

  async getRecentAgentInteractions(limit: number = 50): Promise<AgentInteraction[]> {
    return this.agentInteractionsList.slice(0, limit);
  }

  async getAgentVideos(): Promise<AgentVideo[]> {
    return [...this.agentVideosList].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id - a.id
    );
  }

  async getAgentVideoById(id: number): Promise<AgentVideo | undefined> {
    return this.agentVideosList.find((v) => v.id === id);
  }

  async createAgentVideo(data: InsertAgentVideo): Promise<AgentVideo> {
    const now = new Date();
    const created: AgentVideo = {
      id: this.nextId++,
      packageId: data.packageId,
      title: data.title,
      archetypeId: data.archetypeId,
      viralFormat: data.viralFormat,
      status: data.status ?? "pending_review",
      videoUrl: data.videoUrl,
      caption: data.caption,
      hookText: data.hookText,
      directorReport: data.directorReport,
      declineReason: data.declineReason ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.agentVideosList.unshift(created);
    return created;
  }

  async updateAgentVideo(
    id: number,
    data: Partial<InsertAgentVideo>
  ): Promise<AgentVideo | undefined> {
    const video = this.agentVideosList.find((v) => v.id === id);
    if (!video) return undefined;
    if (data.packageId !== undefined) video.packageId = data.packageId;
    if (data.title !== undefined) video.title = data.title;
    if (data.archetypeId !== undefined) video.archetypeId = data.archetypeId;
    if (data.viralFormat !== undefined) video.viralFormat = data.viralFormat;
    if (data.status !== undefined) video.status = data.status;
    if (data.videoUrl !== undefined) video.videoUrl = data.videoUrl;
    if (data.caption !== undefined) video.caption = data.caption;
    if (data.hookText !== undefined) video.hookText = data.hookText;
    if (data.directorReport !== undefined) video.directorReport = data.directorReport;
    if (data.declineReason !== undefined) video.declineReason = data.declineReason ?? null;
    video.updatedAt = new Date();
    return video;
  }
}

export const storage: IStorage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();


