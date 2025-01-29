ALTER TABLE "templates" DROP CONSTRAINT "templates_user_id_users_users_id_seq_fk";
--> statement-breakpoint
ALTER TABLE "header" DROP CONSTRAINT "header_template_id_templates_templates_id_seq_fk";
--> statement-breakpoint
ALTER TABLE "experience" DROP CONSTRAINT "experience_template_id_templates_templates_id_seq_fk";
--> statement-breakpoint
ALTER TABLE "education" DROP CONSTRAINT "education_template_id_templates_templates_id_seq_fk";
--> statement-breakpoint
ALTER TABLE "skills" DROP CONSTRAINT "skills_template_id_templates_templates_id_seq_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "header" ADD CONSTRAINT "header_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience" ADD CONSTRAINT "experience_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_template_id_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "users_id_seq";--> statement-breakpoint
ALTER TABLE "templates" DROP COLUMN "templates_id_seq";