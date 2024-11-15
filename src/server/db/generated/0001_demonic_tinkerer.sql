ALTER TABLE "product_colors" DROP CONSTRAINT "product_colors_product_id_color_unique";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_colors_color_idx" ON "product_colors" USING btree ("color");--> statement-breakpoint
ALTER TABLE "product_colors" ADD CONSTRAINT "product_colors_color_unique" UNIQUE("color");