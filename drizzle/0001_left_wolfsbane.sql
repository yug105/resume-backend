CREATE TABLE "userss" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_userss_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."userss"("id") ON DELETE no action ON UPDATE no action;