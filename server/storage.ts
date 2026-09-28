import { 
  subscribers, users, marketingEmails, emailLogs, resetRuns, resetItems,
  type Subscriber, type InsertSubscriber, type User, type InsertUser, 
  type MarketingEmail, type InsertMarketingEmail, type EmailLog, type InsertEmailLog,
  type ResetRun, type InsertResetRun, type ResetItem, type InsertResetItem
} from "@shared/schema";
import session from "express-session";
import { db, pool } from "./db";
import { eq } from "drizzle-orm";
import connectPgSimple from "connect-pg-simple";

const PostgresSessionStore = connectPgSimple(session);

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
  createResetRun(
    resetRun: Omit<InsertResetRun, "id" | "createdAt" | "updatedAt">,
    items: Omit<InsertResetItem, "id" | "resetRunId" | "createdAt" | "updatedAt">[]
  ): Promise<{ resetRun: ResetRun; items: ResetItem[] } | { existingRun: ResetRun }>;

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
}

export const storage = new DatabaseStorage();
