import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { timestamps } from "./timestamp";
import { productSizes } from "./products";

export const orders = table("orders", {
  id: t.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: t.varchar("user_id", { length: 256 }).notNull(),
  ...timestamps,
});

export const orderItems = table("order_items", {
  id: t.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  orderId: t
    .integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productSizeId: t
    .integer("product_size_id")
    .references(() => productSizes.id)
    .notNull(),
  quantity: t.integer("quantity").notNull(),
  ...timestamps,
});

export type InferOrder = typeof orders.$inferSelect;
export type InferOrderItem = typeof orderItems.$inferSelect;
