CREATE TYPE "public"."task_category" AS ENUM('required', 'recommended', 'optional');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('low', 'normal', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('in_queue', 'on_progress', 'blocked', 'complete');--> statement-breakpoint
CREATE TABLE "ai_task_suggestion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deal_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"priority" "task_priority" DEFAULT 'normal' NOT NULL,
	"category" "task_category" DEFAULT 'recommended' NOT NULL,
	"is_accepted" boolean DEFAULT false NOT NULL,
	"is_dismissed" boolean DEFAULT false NOT NULL,
	"accepted_at" timestamp,
	"dismissed_at" timestamp,
	"suggested_assignee_id" uuid,
	"created_task_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subtask" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deal_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "task_status" DEFAULT 'in_queue' NOT NULL,
	"priority" "task_priority" DEFAULT 'normal' NOT NULL,
	"category" "task_category" DEFAULT 'required' NOT NULL,
	"assignee_id" uuid,
	"created_by" uuid NOT NULL,
	"due_date" timestamp,
	"completed_at" timestamp,
	"is_ai_generated" boolean DEFAULT false NOT NULL,
	"progress_percentage" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"action" text NOT NULL,
	"description" text NOT NULL,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_attachment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"name" text NOT NULL,
	"file_path" text NOT NULL,
	"file_size" integer,
	"mime_type" text,
	"uploaded_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_comment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_task_suggestion" ADD CONSTRAINT "ai_task_suggestion_deal_id_deal_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."deal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_task_suggestion" ADD CONSTRAINT "ai_task_suggestion_suggested_assignee_id_user_id_fk" FOREIGN KEY ("suggested_assignee_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_task_suggestion" ADD CONSTRAINT "ai_task_suggestion_created_task_id_task_id_fk" FOREIGN KEY ("created_task_id") REFERENCES "public"."task"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subtask" ADD CONSTRAINT "subtask_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_deal_id_deal_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."deal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_assignee_id_user_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_activity" ADD CONSTRAINT "task_activity_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_activity" ADD CONSTRAINT "task_activity_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_attachment" ADD CONSTRAINT "task_attachment_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_attachment" ADD CONSTRAINT "task_attachment_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_comment" ADD CONSTRAINT "task_comment_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_comment" ADD CONSTRAINT "task_comment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;