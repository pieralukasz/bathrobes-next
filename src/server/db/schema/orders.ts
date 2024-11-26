import { pgTable, integer, varchar, index } from "drizzle-orm/pg-core";
import { timestampColumns } from "./timestamp";
import { productSizes } from "./products";

export const orders = pgTable(
  "orders",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    note: varchar("note", { length: 512 }),
    ...timestampColumns,
  },
  (table) => ({
    userIdx: index("orders_user_id_idx").on(table.userId),
  }),
);

export const orderItems = pgTable(
  "order_items",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    orderId: integer("order_id")
      .references(() => orders.id, { onDelete: "cascade" })
      .notNull(),
    productSizeId: integer("product_size_id")
      .references(() => productSizes.id)
      .notNull(),
    quantity: integer("quantity").notNull(),

    ...timestampColumns,
  },
  (table) => ({
    orderIdx: index("order_items_order_id_idx").on(table.orderId),
    productSizeIdx: index("order_items_product_size_id_idx").on(
      table.productSizeId,
    ),
  }),
);

export type InferOrder = typeof orders.$inferSelect;
export type InferOrderItem = typeof orderItems.$inferSelect;
