CREATE EXTENSION IF NOT EXISTS "pgcrypto";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('client', 'attorney', 'admin');--> statement-breakpoint
CREATE TABLE "audit_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid,
  "action" varchar(120) NOT NULL,
  "ip_address" varchar(64),
  "user_agent" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "token_hash" text NOT NULL,
  "ip_address" varchar(64),
  "user_agent" text,
  "expires_at" timestamp with time zone NOT NULL,
  "revoked_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" varchar(255) NOT NULL,
  "name" varchar(160) NOT NULL,
  "role" "user_role" DEFAULT 'client' NOT NULL,
  "password_hash" text NOT NULL,
  "email_verified_at" timestamp with time zone,
  "disabled_at" timestamp with time zone,
  "last_login_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_sessions" ADD CONSTRAINT "refresh_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "refresh_sessions_user_id_idx" ON "refresh_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "refresh_sessions_token_hash_idx" ON "refresh_sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");
