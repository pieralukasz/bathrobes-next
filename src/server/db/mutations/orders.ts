import { db } from "..";
import { orders, orderItems, baskets, basketItems } from "../schema";
import { eq } from "drizzle-orm";

export async function createOrder(userId: string) {
  return await db.transaction(async (tx) => {
    // 1. Create new order
    const [newOrder] = await tx.insert(orders).values({ userId }).returning();

    if (!newOrder) {
      throw new Error("Failed to create order");
    }

    const [basket] = await tx
      .select()
      .from(baskets)
      .where(eq(baskets.userId, userId));

    if (!basket) {
      throw new Error("No basket found for user");
    }

    // 3. Get all basket items
    const userBasketItems = await tx
      .select()
      .from(basketItems)
      .where(eq(basketItems.basketId, basket.id));

    // 4. Create order items from basket items
    if (userBasketItems.length > 0) {
      await tx.insert(orderItems).values(
        userBasketItems.map((item) => ({
          orderId: newOrder.id,
          productSizeId: item.productSizeId,
          quantity: item.quantity,
        })),
      );
    }

    // 5. Clear basket items
    await tx.delete(basketItems).where(eq(basketItems.basketId, basket.id));

    return newOrder;
  });
}
