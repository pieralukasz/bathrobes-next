import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { timestamps } from "./timestamp";
import { InferCategory, categories } from "./categories";

export const products = table("products", {
  id: t.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: t.varchar("name", { length: 256 }).notNull(),
  slug: t.varchar("slug", { length: 256 }).notNull(),
  description: t.varchar("description", { length: 512 }),
  categoryId: t
    .integer("category_id")
    .references(() => categories.id)
    .notNull(),
  isFeatured: t.boolean("is_featured").default(false),
  isNewArrival: t.boolean("is_new_arrival").default(false),
  ...timestamps,
});

export const productColors = table("product_colors", {
  id: t.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  productId: t
    .integer("product_id")
    .references(() => products.id)
    .notNull(),
  color: t.varchar("color", { length: 50 }).notNull(),
  imageUrl: t.varchar("image_url", { length: 256 }),
  ...timestamps,
});

export const productSizes = table("product_sizes", {
  id: t.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  colorId: t
    .integer("color_id")
    .references(() => productColors.id)
    .notNull(),
  size: t.varchar("size", { length: 50 }).notNull(),
  ean: t.varchar("ean", { length: 13 }).notNull(),
  quantity: t.integer("quantity").notNull(),
  ...timestamps,
});

export type InferProduct = typeof products.$inferSelect & {
  category: InferCategory;
  colors: InferProductColor[];
};

export type InferProductColor = typeof productColors.$inferSelect & {
  sizes: InferProductSize[];
};

export type InferProductSize = typeof productSizes.$inferSelect;
