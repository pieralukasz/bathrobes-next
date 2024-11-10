import {
  index,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const createdAt = timestamp("created_at", { withTimezone: true })
  .$onUpdate(() => new Date())
  .notNull();

const updatedAt = timestamp("updated_at", { withTimezone: true }).$onUpdate(
  () => new Date(),
);

export const categories = pgTable("ll-bathrobes_categories", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt,
  updatedAt,
});

export const products = pgTable("ll-bathrobes_products", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),
  categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),
  createdAt,
  updatedAt,
});

export const productColors = pgTable("ll-bathrobes_product_colors", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  color: varchar("color", { length: 50 }).notNull(),
  imageUrl: varchar("image_url", { length: 256 }),
  createdAt,
  updatedAt,
});

export const productSizes = pgTable(
  "ll-bathrobes_product_sizes",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    colorId: integer("color_id")
      .references(() => productColors.id)
      .notNull(),
    size: varchar("size", { length: 50 }).notNull(),
    ean: varchar("ean", { length: 13 }).notNull(),
    quantity: integer("quantity").notNull(),
    createdAt,
    updatedAt,
  },
  (example) => {
    return {
      eanIndex: index("ean_idx").on(example.ean),
    };
  },
);

export const baskets = pgTable("ll-bathrobes_baskets", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  createdAt,
  updatedAt,
});

export const basketItems = pgTable("ll-bathrobes_basket_items", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  basketId: integer("basket_id")
    .references(() => baskets.id, { onDelete: "cascade" })
    .notNull(),
  productSizeId: integer("product_size_id")
    .references(() => productSizes.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
});

export const orders = pgTable("ll-bathrobes_orders", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  createdAt,
  updatedAt,
});

export const orderItems = pgTable("ll-bathrobes_order_items", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productSizeId: integer("product_size_id")
    .references(() => productSizes.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  colors: many(productColors),
}));

export const productColorsRelations = relations(
  productColors,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productColors.productId],
      references: [products.id],
    }),
    sizes: many(productSizes),
  }),
);

export const productSizesRelations = relations(productSizes, ({ one }) => ({
  color: one(productColors, {
    fields: [productSizes.colorId],
    references: [productColors.id],
  }),
}));

export const basketsRelations = relations(baskets, ({ many }) => ({
  items: many(basketItems),
}));

export const basketItemsRelations = relations(basketItems, ({ one }) => ({
  basket: one(baskets, {
    fields: [basketItems.basketId],
    references: [baskets.id],
  }),
  productSize: one(productSizes, {
    fields: [basketItems.productSizeId],
    references: [productSizes.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  productSize: one(productSizes, {
    fields: [orderItems.productSizeId],
    references: [productSizes.id],
  }),
}));
