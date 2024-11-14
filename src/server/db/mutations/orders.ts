import { db } from "..";
import {
  orders,
  orderItems,
  baskets,
  basketItems,
  productSizes,
} from "../schema";
import { eq } from "drizzle-orm";

export async function createOrder(userId: string) {
  console.log("Starting order creation for user:", userId);

  return await db.transaction(async (tx) => {
    try {
      console.log("Getting basket...");
      const [basket] = await tx
        .select()
        .from(baskets)
        .where(eq(baskets.userId, userId));

      if (!basket) {
        console.error("No basket found for user:", userId);
        throw new Error("NO_BASKET");
      }

      console.log("Getting basket items...");
      const basketItemsWithProducts = await tx
        .select({
          basketItem: basketItems,
          productSize: productSizes,
        })
        .from(basketItems)
        .innerJoin(productSizes, eq(basketItems.productSizeId, productSizes.id))
        .where(eq(basketItems.basketId, basket.id));

      console.log("Found basket items:", basketItemsWithProducts.length);

      if (basketItemsWithProducts.length === 0) {
        console.error("Empty basket for user:", userId);
        throw new Error("EMPTY_BASKET");
      }

      console.log("Creating order...");
      const [newOrder] = await tx.insert(orders).values({ userId }).returning();

      if (!newOrder?.id) {
        console.error("Failed to create order");
        throw new Error("ORDER_CREATION_FAILED");
      }

      console.log("Creating order items...");
      const orderItemValues = basketItemsWithProducts.map(({ basketItem }) => ({
        orderId: newOrder.id,
        productSizeId: basketItem.productSizeId,
        quantity: basketItem.quantity,
      }));

      const orderItemsResult = await tx
        .insert(orderItems)
        .values(orderItemValues)
        .returning();

      if (!orderItemsResult.length) {
        console.error("Failed to create order items");
        throw new Error("ORDER_ITEMS_CREATION_FAILED");
      }

      console.log("Clearing basket...");
      const deleteResult = await tx
        .delete(basketItems)
        .where(eq(basketItems.basketId, basket.id))
        .returning();

      console.log("Deleted basket items:", deleteResult.length);

      if (!deleteResult.length) {
        console.error("Failed to clear basket");
        throw new Error("BASKET_CLEAR_FAILED");
      }

      console.log("Order created successfully:", newOrder.id);
      return newOrder;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    }
  });
}
