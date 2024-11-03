import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `ll-bathrobes_${name}`);

const createdAt = timestamp("created_at", { withTimezone: true })
  .$onUpdate(() => new Date())
  .notNull();

const updatedAt = timestamp("updated_at", { withTimezone: true }).$onUpdate(
  () => new Date(),
);

export const categories = createTable("categories", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt,
  updatedAt,
});

export const products = createTable(
  "products",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    ean: varchar("ean", { length: 13 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    categoryId: integer("category_id")
      .references(() => categories.id)
      .notNull(),
    color: varchar("color", { length: 50 }).notNull(),
    size: varchar("size", { length: 50 }).notNull(),
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

export const baskets = createTable("baskets", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  createdAt,
  updatedAt,
});

export const basketItems = createTable("basket_items", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  basketId: integer("basket_id")
    .references(() => baskets.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
});

export const orders = createTable("orders", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  createdAt,
  updatedAt,
});

export const orderItems = createTable("order_items", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
});
