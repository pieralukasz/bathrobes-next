import { pgTable, integer, varchar, index, unique } from "drizzle-orm/pg-core";
import { timestampColumns } from "./timestamp";
import { productSizes } from "./products";

export const baskets = pgTable(
  "baskets",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    ...timestampColumns,
  },
  (table) => ({
    userIdx: index("baskets_user_id_idx").on(table.userId),
  }),
);

export const basketItems = pgTable(
  "basket_items",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    basketId: integer("basket_id")
      .references(() => baskets.id, { onDelete: "cascade" })
      .notNull(),
    productSizeId: integer("product_size_id")
      .references(() => productSizes.id)
      .notNull(),
    quantity: integer("quantity").notNull(),
    ...timestampColumns,
  },
  (table) => ({
    basketIdx: index("basket_items_basket_id_idx").on(table.basketId),
    productSizeIdx: index("basket_items_product_size_id_idx").on(
      table.productSizeId,
    ),
    unq: unique().on(table.basketId, table.productSizeId),
  }),
);

export type InferBasket = typeof baskets.$inferSelect;

export type InferBasketItem = typeof basketItems.$inferSelect;
