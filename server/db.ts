import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL && process.env.NODE_ENV === "production") {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

if (!process.env.DATABASE_URL) {
  console.warn(
    "Warning: DATABASE_URL is not set. Falling back to in-memory storage for local development."
  );
}

export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : (null as unknown as Pool);

export const db = process.env.DATABASE_URL
  ? drizzle({ client: pool, schema })
  : (null as unknown as ReturnType<typeof drizzle<typeof schema>>);

let tablesInitializedPromise: Promise<void> | null = null;

export async function ensureProductionTables(): Promise<void> {
  if (!pool) return;
  if (tablesInitializedPromise) return tablesInitializedPromise;

  tablesInitializedPromise = (async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS "session" (
          "sid" varchar NOT NULL COLLATE "default",
          "sess" json NOT NULL,
          "expire" timestamp(6) NOT NULL,
          CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
        );
        CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

        CREATE TABLE IF NOT EXISTS "subscribers" (
          "id" serial PRIMARY KEY NOT NULL,
          "email" text NOT NULL UNIQUE,
          "created_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "users" (
          "id" serial PRIMARY KEY NOT NULL,
          "username" text NOT NULL UNIQUE,
          "password" text NOT NULL,
          "email" text,
          "first_name" text,
          "stripe_session_id" text UNIQUE,
          "created_at" timestamp DEFAULT now() NOT NULL
        );
        ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" text;
        ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "first_name" text;

        CREATE TABLE IF NOT EXISTS "marketing_emails" (
          "id" serial PRIMARY KEY NOT NULL,
          "email" text NOT NULL UNIQUE,
          "first_name" text,
          "opted_in_at" timestamp DEFAULT now() NOT NULL,
          "is_active" text DEFAULT 'true' NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "email_logs" (
          "id" serial PRIMARY KEY NOT NULL,
          "email" text NOT NULL,
          "email_type" text NOT NULL,
          "subject" text NOT NULL,
          "status" text NOT NULL,
          "sent_at" timestamp DEFAULT now() NOT NULL,
          "user_id" integer REFERENCES "users"("id")
        );

        CREATE TABLE IF NOT EXISTS "reset_runs" (
          "id" serial PRIMARY KEY NOT NULL,
          "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE cascade,
          "catalog_version" text NOT NULL,
          "status" text NOT NULL,
          "phase" text,
          "schedule_revision" integer DEFAULT 0 NOT NULL,
          "timezone" text NOT NULL,
          "start_at" timestamp with time zone,
          "target_bedtime_at" timestamp with time zone,
          "target_next_morning_at" timestamp with time zone,
          "reset_goal" text,
          "food_preference" text,
          "movement_access" text,
          "blocked_times_json" json,
          "started_at" timestamp with time zone,
          "sleep_started_at" timestamp with time zone,
          "next_morning_started_at" timestamp with time zone,
          "completed_at" timestamp with time zone,
          "created_at" timestamp with time zone DEFAULT now() NOT NULL,
          "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
          CONSTRAINT "reset_runs_status_chk" CHECK ("status" IN ('setup', 'ready', 'active', 'sleep', 'next_morning', 'completed', 'abandoned')),
          CONSTRAINT "reset_runs_phase_chk" CHECK ("phase" IS NULL OR "phase" IN ('morning', 'midday', 'afternoon', 'evening', 'sleep', 'next_morning'))
        );

        CREATE TABLE IF NOT EXISTS "reset_items" (
          "id" serial PRIMARY KEY NOT NULL,
          "reset_run_id" integer NOT NULL REFERENCES "reset_runs"("id") ON DELETE cascade,
          "activity_key" text NOT NULL,
          "variant_key" text,
          "phase" text NOT NULL,
          "sequence" integer NOT NULL,
          "original_scheduled_at" timestamp with time zone NOT NULL,
          "scheduled_at" timestamp with time zone NOT NULL,
          "duration_minutes" integer NOT NULL,
          "status" text NOT NULL,
          "completed_at" timestamp with time zone,
          "skipped_at" timestamp with time zone,
          "created_at" timestamp with time zone DEFAULT now() NOT NULL,
          "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
          CONSTRAINT "reset_items_status_chk" CHECK ("status" IN ('scheduled', 'active', 'completed', 'skipped')),
          CONSTRAINT "reset_items_phase_chk" CHECK ("phase" IN ('morning', 'midday', 'afternoon', 'evening', 'next_morning'))
        );

        CREATE TABLE IF NOT EXISTS "reset_entries" (
          "id" serial PRIMARY KEY NOT NULL,
          "reset_run_id" integer NOT NULL REFERENCES "reset_runs"("id") ON DELETE cascade,
          "reset_item_id" integer REFERENCES "reset_items"("id") ON DELETE set null,
          "kind" text NOT NULL,
          "content" text NOT NULL,
          "created_at" timestamp with time zone DEFAULT now() NOT NULL
        );

        CREATE INDEX IF NOT EXISTS "reset_runs_user_id_idx" ON "reset_runs" USING btree ("user_id");
        CREATE INDEX IF NOT EXISTS "reset_items_run_id_status_seq_idx" ON "reset_items" USING btree ("reset_run_id", "status", "sequence");
        CREATE INDEX IF NOT EXISTS "reset_entries_run_id_idx" ON "reset_entries" USING btree ("reset_run_id");

        CREATE TABLE IF NOT EXISTS "agent_leads" (
          "id" serial PRIMARY KEY NOT NULL,
          "email" text NOT NULL UNIQUE,
          "first_name" text,
          "source" text DEFAULT 'quiz' NOT NULL,
          "archetype_id" text DEFAULT 'cortisol_spiked' NOT NULL,
          "wake_time" text DEFAULT '07:00' NOT NULL,
          "food_preference" text DEFAULT 'omni' NOT NULL,
          "past_blocker" text DEFAULT 'ran_late' NOT NULL,
          "nurture_stage" integer DEFAULT 0 NOT NULL,
          "next_email_at" timestamp,
          "has_purchased" boolean DEFAULT false NOT NULL,
          "unsubscribed" boolean DEFAULT false NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL,
          "updated_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "agent_interactions" (
          "id" serial PRIMARY KEY NOT NULL,
          "channel" text NOT NULL,
          "sender_identifier" text NOT NULL,
          "inbound_message" text,
          "agent_reply" text NOT NULL,
          "metadata" text,
          "created_at" timestamp DEFAULT now() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS "agent_videos" (
          "id" serial PRIMARY KEY NOT NULL,
          "package_id" text NOT NULL,
          "title" text NOT NULL,
          "archetype_id" text NOT NULL,
          "viral_format" text NOT NULL,
          "status" text DEFAULT 'pending_review' NOT NULL,
          "video_url" text NOT NULL,
          "caption" text NOT NULL,
          "hook_text" text NOT NULL,
          "director_report" text NOT NULL,
          "decline_reason" text,
          "created_at" timestamp DEFAULT now() NOT NULL,
          "updated_at" timestamp DEFAULT now() NOT NULL
        );
      `);
    } catch (err: any) {
      console.warn("Non-fatal ensureProductionTables warning:", err?.message || err);
    }
  })();

  return tablesInitializedPromise;
}

if (pool) {
  ensureProductionTables().catch(() => {});
}