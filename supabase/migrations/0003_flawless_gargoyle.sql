ALTER TABLE "orders" ADD COLUMN "note" varchar(512);--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN IF EXISTS "note";