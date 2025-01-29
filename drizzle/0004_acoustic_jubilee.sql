CREATE TABLE "templates" (
	"templates_id_seq" serial PRIMARY KEY NOT NULL,
	"about" text NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "header" (
	"header" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	"country" text NOT NULL,
	"phone" integer NOT NULL,
	"email" text NOT NULL,
	"template_id" integer
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"experience" serial PRIMARY KEY NOT NULL,
	"jobtitle" text,
	"company" text,
	"country" text,
	"months" smallint DEFAULT 0,
	"template_id" integer
);
--> statement-breakpoint
CREATE TABLE "education" (
	"education" serial PRIMARY KEY NOT NULL,
	"institute" text,
	"location" text,
	"degree" text,
	"field" text,
	"graduationyear" integer,
	"template_id" integer
);
--> statement-breakpoint
CREATE TABLE "skill" (
	"skill_id" serial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"skills" serial PRIMARY KEY NOT NULL,
	"skill_id" integer,
	"template_id" integer
);
--> statement-breakpoint
ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "userss" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "posts" CASCADE;--> statement-breakpoint
DROP TABLE "userss" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "users_id_seq" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_user_id_users_users_id_seq_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("users_id_seq") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "header" ADD CONSTRAINT "header_template_id_templates_templates_id_seq_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("templates_id_seq") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience" ADD CONSTRAINT "experience_template_id_templates_templates_id_seq_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("templates_id_seq") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_template_id_templates_templates_id_seq_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("templates_id_seq") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_skill_id_skill_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skill"("skill_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_template_id_templates_templates_id_seq_fk" FOREIGN KEY ("template_id") REFERENCES "public"."templates"("templates_id_seq") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "age";