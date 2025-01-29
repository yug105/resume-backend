ALTER TABLE "header" RENAME COLUMN "header" TO "id";--> statement-breakpoint
ALTER TABLE "experience" RENAME COLUMN "experience" TO "id";--> statement-breakpoint
ALTER TABLE "education" RENAME COLUMN "education" TO "id";--> statement-breakpoint
ALTER TABLE "skill" RENAME COLUMN "skill_id" TO "id";--> statement-breakpoint
ALTER TABLE "skills" RENAME COLUMN "skills" TO "id";--> statement-breakpoint
ALTER TABLE "skills" DROP CONSTRAINT "skills_skill_id_skill_skill_id_fk";
--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_skill_id_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skill"("id") ON DELETE no action ON UPDATE no action;