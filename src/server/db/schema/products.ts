import {
  pgTable,
  integer,
  varchar,
  boolean,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { timestampColumns } from "./timestamp";

export const categories = pgTable(
  "categories",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull(),
    ...timestampColumns,
  },
  (table) => ({
    slugUnq: unique().on(table.slug),
  }),
);

export type InferCategory = typeof categories.$inferSelect;

export const products = pgTable(
  "products",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull(),
    description: varchar("description", { length: 512 }),
    categoryId: integer("category_id")
      .references(() => categories.id)
      .notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isNewArrival: boolean("is_new_arrival").default(false).notNull(),
    ...timestampColumns,
  },
  (table) => ({
    categoryIdx: index("products_category_id_idx").on(table.categoryId),
    slugIdx: index("products_slug_idx").on(table.slug),
    slugUnq: unique("products_slug_unique").on(table.slug),
  }),
);

export const productColors = pgTable(
  "product_colors",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    productId: integer("product_id")
      .references(() => products.id)
      .notNull(),
    color: varchar("color", { length: 50 }).notNull(),
    imageUrl: varchar("image_url", { length: 256 }),
    ...timestampColumns,
  },
  (table) => ({
    productIdx: index("product_colors_product_id_idx").on(table.productId),
    colorIdx: index("product_colors_color_idx").on(table.color),
    unq: unique().on(table.productId, table.color),
  }),
);

export const productSizes = pgTable(
  "product_sizes",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    colorId: integer("color_id")
      .references(() => productColors.id)
      .notNull(),
    size: varchar("size", { length: 50 }).notNull(),
    ean: varchar("ean", { length: 13 }).notNull().unique(),
    quantity: integer("quantity").notNull(),
    ...timestampColumns,
  },
  (table) => ({
    colorIdx: index("product_sizes_color_id_idx").on(table.colorId),
    eanIdx: index("product_sizes_ean_idx").on(table.ean),
    unq: unique().on(table.colorId, table.size, table.ean),
  }),
);

export type InferProduct = typeof products.$inferSelect;

export type InferProductColor = typeof productColors.$inferSelect;

export type InferProductSize = typeof productSizes.$inferSelect;
