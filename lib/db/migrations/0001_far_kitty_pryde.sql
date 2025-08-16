CREATE TYPE "public"."document_requirement_status" AS ENUM('uploaded', 'missing', 'recommended');--> statement-breakpoint
CREATE TABLE "document_requirement" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deal_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"status" "document_requirement_status" DEFAULT 'missing' NOT NULL,
	"is_required" boolean DEFAULT true NOT NULL,
	"uploaded_document_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "document" ALTER COLUMN "file_type" SET DEFAULT 'file';--> statement-breakpoint
ALTER TABLE "document" ALTER COLUMN "file_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN "file_size" integer;--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN "mime_type" text;--> statement-breakpoint
ALTER TABLE "document_requirement" ADD CONSTRAINT "document_requirement_deal_id_deal_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."deal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_requirement" ADD CONSTRAINT "document_requirement_uploaded_document_id_document_id_fk" FOREIGN KEY ("uploaded_document_id") REFERENCES "public"."document"("id") ON DELETE no action ON UPDATE no action;