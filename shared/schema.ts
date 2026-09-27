import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  firstName: text("first_name"),
  stripeSessionId: text("stripe_session_id").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const marketingEmails = pgTable("marketing_emails", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  optedInAt: timestamp("opted_in_at").defaultNow().notNull(),
  isActive: text("is_active").default("true").notNull(),
});

export const emailLogs = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  emailType: text("email_type").notNull(), // 'welcome', 'marketing', etc.
  subject: text("subject").notNull(),
  status: text("status").notNull(), // 'sent', 'failed'
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  userId: serial("user_id").references(() => users.id),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  email: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  stripeSessionId: true,
});

export const insertMarketingEmailSchema = createInsertSchema(marketingEmails).pick({
  email: true,
  firstName: true,
});

export const insertEmailLogSchema = createInsertSchema(emailLogs).pick({
  email: true,
  emailType: true,
  subject: true,
  status: true,
  userId: true,
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMarketingEmail = z.infer<typeof insertMarketingEmailSchema>;
export type MarketingEmail = typeof marketingEmails.$inferSelect;
export type InsertEmailLog = z.infer<typeof insertEmailLogSchema>;
export type EmailLog = typeof emailLogs.$inferSelect;
