import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { timestamps } from "./timestamp";
import { InferProductSize, productSizes } from "./products";

export const baskets = table("baskets", {
  id: t.integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: t.varchar("user_id", { length: 256 }).notNull(),
  ...timestamps,
});

export const basketItems = table(
  "basket_items",
  {
    id: t.integer("id").primaryKey().generatedByDefaultAsIdentity(),
    basketId: t
      .integer("basket_id")
      .references(() => baskets.id, { onDelete: "cascade" })
      .notNull(),
    productSizeId: t
      .integer("product_size_id")
      .references(() => productSizes.id)
      .notNull(),
    quantity: t.integer("quantity").notNull(),
    ...timestamps,
  },
  (table) => ({
    unq: t.unique().on(table.basketId, table.productSizeId),
  }),
);

export type InferBasket = typeof baskets.$inferSelect & {
  items: (typeof basketItems.$inferSelect & {
    productSize: InferProductSize;
  })[];
};

export type InferBasketItem = typeof basketItems.$inferSelect & {
  productSize: InferProductSize;
};
