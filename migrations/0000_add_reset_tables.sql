CREATE TABLE "reset_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"reset_run_id" integer NOT NULL,
	"reset_item_id" integer,
	"kind" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reset_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"reset_run_id" integer NOT NULL,
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
--> statement-breakpoint
CREATE TABLE "reset_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
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
--> statement-breakpoint
ALTER TABLE "reset_entries" ADD CONSTRAINT "reset_entries_reset_run_id_reset_runs_id_fk" FOREIGN KEY ("reset_run_id") REFERENCES "public"."reset_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reset_entries" ADD CONSTRAINT "reset_entries_reset_item_id_reset_items_id_fk" FOREIGN KEY ("reset_item_id") REFERENCES "public"."reset_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reset_items" ADD CONSTRAINT "reset_items_reset_run_id_reset_runs_id_fk" FOREIGN KEY ("reset_run_id") REFERENCES "public"."reset_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reset_runs" ADD CONSTRAINT "reset_runs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reset_entries_run_id_idx" ON "reset_entries" USING btree ("reset_run_id");--> statement-breakpoint
CREATE INDEX "reset_items_run_id_status_seq_idx" ON "reset_items" USING btree ("reset_run_id","status","sequence");--> statement-breakpoint
CREATE INDEX "reset_runs_user_id_idx" ON "reset_runs" USING btree ("user_id");
