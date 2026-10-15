import { 
  subscribers, users, marketingEmails, emailLogs, resetRuns, resetItems,
  type Subscriber, type InsertSubscriber, type User, type InsertUser, 
  type MarketingEmail, type InsertMarketingEmail, type EmailLog, type InsertEmailLog,
  type ResetRun, type InsertResetRun, type ResetItem, type InsertResetItem,
  type ResetEntry, type InsertResetEntry, resetEntries
} from "@shared/schema";
import session from "express-session";
import { db, pool } from "./db";
import { eq, asc, and } from "drizzle-orm";
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

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
    });
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const [subscriber] = await db
      .insert(subscribers)
      .values(insertSubscriber)
      .returning();
    return subscriber;
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email));
    return subscriber || undefined;
  }

  async getAllSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user || undefined;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByStripeSessionId(sessionId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.stripeSessionId, sessionId));
    return user || undefined;
  }

  async addMarketingEmail(data: InsertMarketingEmail): Promise<MarketingEmail> {
    const [marketingEmail] = await db
      .insert(marketingEmails)
      .values(data)
      .returning();
    return marketingEmail;
  }

  async logEmail(data: InsertEmailLog): Promise<EmailLog> {
    const [emailLog] = await db
      .insert(emailLogs)
      .values(data)
      .returning();
    return emailLog;
  }

  async getAllEmailLogs(): Promise<EmailLog[]> {
    return await db.select().from(emailLogs);
  }

  async getMarketingEmails(): Promise<MarketingEmail[]> {
    return await db.select().from(marketingEmails);
  }

  async getResetRunByUserId(userId: number): Promise<ResetRun | undefined> {
    const [run] = await db
      .select()
      .from(resetRuns)
      .where(eq(resetRuns.userId, userId));
    return run || undefined;
  }

  async getResetRunAndItemsByUserId(userId: number): Promise<{ resetRun: ResetRun; items: ResetItem[] } | undefined> {
    const run = await this.getResetRunByUserId(userId);
    if (!run) return undefined;

    const items = await db
      .select()
      .from(resetItems)
      .where(eq(resetItems.resetRunId, run.id))
      .orderBy(asc(resetItems.sequence));

    return { resetRun: run, items };
  }

  async createResetRun(
    insertRun: Omit<InsertResetRun, "id" | "createdAt" | "updatedAt">,
    insertItems: Omit<InsertResetItem, "id" | "resetRunId" | "createdAt" | "updatedAt">[]
  ): Promise<{ resetRun: ResetRun; items: ResetItem[] } | { existingRun: ResetRun }> {
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
  }

  async startResetRunForUser(userId: number): Promise<StartResetResult> {
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
  }

  async advanceResetItemForUser(userId: number, itemId: number, action: "complete" | "skip"): Promise<AdvanceResetResult> {
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
  }

  async startNextMorningForUser(userId: number): Promise<StartNextMorningResult> {
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
  }

  async saveResetEntryForUser(userId: number, kind: string, content: string): Promise<SaveEntryResult> {
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
  }

  async getResetEntriesForUser(userId: number): Promise<{ type: "not_found" } | { type: "success", entries: ResetEntry[] }> {
    const run = await db.query.resetRuns.findFirst({
      where: eq(resetRuns.userId, userId)
    });

    if (!run) return { type: "not_found" };

    const entries = await db.select()
      .from(resetEntries)
      .where(eq(resetEntries.resetRunId, run.id))
      .orderBy(asc(resetEntries.createdAt), asc(resetEntries.id));

    return { type: "success", entries };
  }

  async updateResetFoodPreferenceForUser(userId: number, foodPreference: string): Promise<{ type: "not_found" } | { type: "success", resetRun: ResetRun }> {
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
  }

  async delayResetItemForUser(userId: number, itemId: number, delayMinutes: number, expectedScheduleRevision: number): Promise<DelayResetResult> {
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
    item.status = action === "complete" ? "completed" : "skipped";
    const next = data.items.find((i) => i.status === "scheduled");
    if (next) {
      next.status = "active";
      data.resetRun.phase = next.phase;
    } else {
      data.resetRun.status = "completed";
      data.resetRun.phase = null;
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
    data.resetRun.status = "active";
    data.resetRun.phase = "next_morning";
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
}

export const storage: IStorage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();
