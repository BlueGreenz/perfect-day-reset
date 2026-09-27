import { subscribers, users, marketingEmails, emailLogs, type Subscriber, type InsertSubscriber, type User, type InsertUser, type MarketingEmail, type InsertMarketingEmail, type EmailLog, type InsertEmailLog } from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq } from "drizzle-orm";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
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
}

export const storage = new DatabaseStorage();
