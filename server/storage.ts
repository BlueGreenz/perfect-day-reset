import { 
  subscribers, users, marketingEmails, emailLogs, resetRuns, resetItems,
  type Subscriber, type InsertSubscriber, type User, type InsertUser, 
  type MarketingEmail, type InsertMarketingEmail, type EmailLog, type InsertEmailLog,
  type ResetRun, type InsertResetRun, type ResetItem, type InsertResetItem
} from "@shared/schema";
import session from "express-session";
import { db, pool } from "./db";
import { eq, asc } from "drizzle-orm";
import connectPgSimple from "connect-pg-simple";

const PostgresSessionStore = connectPgSimple(session);

export type StartResetResult = 
  | { type: "not_found" }
  | { type: "invalid_state" }
  | { type: "corrupt_state" }
  | { type: "already_active"; resetRun: ResetRun; items: ResetItem[] }
  | { type: "success"; resetRun: ResetRun; items: ResetItem[] };

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
}

export const storage = new DatabaseStorage();
