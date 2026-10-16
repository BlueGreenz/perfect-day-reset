import { pgTable, text, serial, timestamp, integer, json, index, check, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

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

export const resetRuns = pgTable("reset_runs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  catalogVersion: text("catalog_version").notNull(),
  status: text("status").notNull(), // 'setup', 'ready', 'active', 'sleep', 'next_morning', 'completed', 'abandoned'
  phase: text("phase"), // 'morning', 'midday', 'afternoon', 'evening', 'sleep', 'next_morning' (nullable during setup/ready)
  scheduleRevision: integer("schedule_revision").notNull().default(0),
  timezone: text("timezone").notNull(),
  startAt: timestamp("start_at", { withTimezone: true }),
  targetBedtimeAt: timestamp("target_bedtime_at", { withTimezone: true }),
  targetNextMorningAt: timestamp("target_next_morning_at", { withTimezone: true }),
  resetGoal: text("reset_goal"),
  foodPreference: text("food_preference"),
  movementAccess: text("movement_access"),
  blockedTimesJson: json("blocked_times_json"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  sleepStartedAt: timestamp("sleep_started_at", { withTimezone: true }),
  nextMorningStartedAt: timestamp("next_morning_started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("reset_runs_user_id_idx").on(table.userId),
  check("reset_runs_status_chk", sql`${table.status} IN ('setup', 'ready', 'active', 'sleep', 'next_morning', 'completed', 'abandoned')`),
  check("reset_runs_phase_chk", sql`${table.phase} IS NULL OR ${table.phase} IN ('morning', 'midday', 'afternoon', 'evening', 'sleep', 'next_morning')`)
]);

export const resetItems = pgTable("reset_items", {
  id: serial("id").primaryKey(),
  resetRunId: integer("reset_run_id").notNull().references(() => resetRuns.id, { onDelete: "cascade" }),
  activityKey: text("activity_key").notNull(),
  variantKey: text("variant_key"),
  phase: text("phase").notNull(),
  sequence: integer("sequence").notNull(),
  originalScheduledAt: timestamp("original_scheduled_at", { withTimezone: true }).notNull(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  status: text("status").notNull(), // 'scheduled', 'active', 'completed', 'skipped'
  completedAt: timestamp("completed_at", { withTimezone: true }),
  skippedAt: timestamp("skipped_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("reset_items_run_id_status_seq_idx").on(table.resetRunId, table.status, table.sequence),
  check("reset_items_status_chk", sql`${table.status} IN ('scheduled', 'active', 'completed', 'skipped')`),
  check("reset_items_phase_chk", sql`${table.phase} IN ('morning', 'midday', 'afternoon', 'evening', 'next_morning')`)
]);

export const resetEntries = pgTable("reset_entries", {
  id: serial("id").primaryKey(),
  resetRunId: integer("reset_run_id").notNull().references(() => resetRuns.id, { onDelete: "cascade" }),
  resetItemId: integer("reset_item_id").references(() => resetItems.id, { onDelete: "set null" }),
  kind: text("kind").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("reset_entries_run_id_idx").on(table.resetRunId)
]);

export const agentLeads = pgTable("agent_leads", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  source: text("source").default("quiz").notNull(), // 'quiz', 'checkout_abandoned', 'waitlist', 'ig_dm'
  archetypeId: text("archetype_id").default("cortisol_spiked").notNull(),
  wakeTime: text("wake_time").default("07:00").notNull(),
  foodPreference: text("food_preference").default("omni").notNull(),
  pastBlocker: text("past_blocker").default("ran_late").notNull(),
  nurtureStage: integer("nurture_stage").default(0).notNull(), // 0 -> 1 -> 2 -> 3 -> 4
  nextEmailAt: timestamp("next_email_at"),
  hasPurchased: boolean("has_purchased").default(false).notNull(),
  unsubscribed: boolean("unsubscribed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const agentInteractions = pgTable("agent_interactions", {
  id: serial("id").primaryKey(),
  channel: text("channel").notNull(), // 'email_outbound', 'email_inbound', 'ig_dm', 'tiktok_dm', 'comment_reply'
  senderIdentifier: text("sender_identifier").notNull(),
  inboundMessage: text("inbound_message"),
  agentReply: text("agent_reply").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentVideos = pgTable("agent_videos", {
  id: serial("id").primaryKey(),
  packageId: text("package_id").notNull(),
  title: text("title").notNull(),
  archetypeId: text("archetype_id").notNull(),
  viralFormat: text("viral_format").notNull(),
  status: text("status").default("pending_review").notNull(), // 'analyzing' | 'rendering' | 'pending_review' | 'approved' | 'declined' | 'published'
  videoUrl: text("video_url").notNull(),
  caption: text("caption").notNull(),
  hookText: text("hook_text").notNull(),
  directorReport: text("director_report").notNull(),
  declineReason: text("decline_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

export const insertResetRunSchema = createInsertSchema(resetRuns);
export const insertResetItemSchema = createInsertSchema(resetItems);
export const insertResetEntrySchema = createInsertSchema(resetEntries);

export type InsertResetRun = z.infer<typeof insertResetRunSchema>;
export type ResetRun = typeof resetRuns.$inferSelect;
export type InsertResetItem = z.infer<typeof insertResetItemSchema>;
export type ResetItem = typeof resetItems.$inferSelect;
export type InsertResetEntry = z.infer<typeof insertResetEntrySchema>;
export type ResetEntry = typeof resetEntries.$inferSelect;

export const insertAgentLeadSchema = createInsertSchema(agentLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertAgentInteractionSchema = createInsertSchema(agentInteractions).omit({
  id: true,
  createdAt: true,
});
export const insertAgentVideoSchema = createInsertSchema(agentVideos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAgentLead = z.infer<typeof insertAgentLeadSchema>;
export type AgentLead = typeof agentLeads.$inferSelect;
export type InsertAgentInteraction = z.infer<typeof insertAgentInteractionSchema>;
export type AgentInteraction = typeof agentInteractions.$inferSelect;
export type InsertAgentVideo = z.infer<typeof insertAgentVideoSchema>;
export type AgentVideo = typeof agentVideos.$inferSelect;


