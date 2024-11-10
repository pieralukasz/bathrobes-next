import { relations } from "drizzle-orm";
import { categories } from "./categories";
import { productColors, productSizes, products } from "./products";
import { basketItems, baskets } from "./carts";
import { orderItems, orders } from "./orders";

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
