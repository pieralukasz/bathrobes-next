import { db } from "..";
import { orders, orderItems, baskets, basketItems } from "../schema";
import { eq } from "drizzle-orm";

export async function createOrder(userId: string) {
  try {
    const result = await db.transaction(async (tx) => {
      // Get user's basket first
      const [basket] = await tx
        .select()
        .from(baskets)
        .where(eq(baskets.userId, userId));

      if (!basket) {
        throw new Error("NO_BASKET");
      }

      // Get basket items before creating order
      const userBasketItems = await tx
        .select()
        .from(basketItems)
        .where(eq(basketItems.basketId, basket.id));

      if (userBasketItems.length === 0) {
        throw new Error("EMPTY_BASKET");
      }

      // Create new order
      const [newOrder] = await tx.insert(orders).values({ userId }).returning();

      if (!newOrder?.id) {
        throw new Error("ORDER_CREATION_FAILED");
      }

      // Create order items
      const orderItemsResult = await tx
        .insert(orderItems)
        .values(
          userBasketItems.map((item) => ({
            orderId: newOrder.id,
            productSizeId: item.productSizeId,
            quantity: item.quantity,
          })),
        )
        .returning();

      if (!orderItemsResult.length) {
        throw new Error("ORDER_ITEMS_CREATION_FAILED");
      }

      const deleteResult = await tx
        .delete(basketItems)
        .where(eq(basketItems.basketId, basket.id))
        .returning();

      if (!deleteResult.length) {
        throw new Error("BASKET_ITEMS_DELETE_FAILED");
      }

      return {
        order: newOrder,
        orderItems: orderItemsResult,
        deletedItems: deleteResult,
      };
    });

    if (
      !result.order ||
      !result.orderItems.length ||
      !result.deletedItems.length
    ) {
      throw new Error("TRANSACTION_INCOMPLETE");
    }

    return result.order;
  } catch (error) {
    console.error("Create order error:", error);
    throw error;
  }
}
