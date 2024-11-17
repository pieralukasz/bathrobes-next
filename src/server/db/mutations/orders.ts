import { db } from "..";
import {
  orders,
  orderItems,
  baskets,
  basketItems,
  productSizes,
} from "../schema";
import { eq } from "drizzle-orm";

export class OrderError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "OrderError";
  }
}

export const orderMutations = {
  create: async (userId: string) => {
    if (!userId) throw new OrderError("INVALID_INPUT", "User ID is required");

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
          throw new OrderError("NO_BASKET", "No basket found for user");
        }

        console.log("Getting basket items...");
        const basketItemsWithProducts = await tx
          .select({
            basketItem: basketItems,
            productSize: productSizes,
          })
          .from(basketItems)
          .innerJoin(
            productSizes,
            eq(basketItems.productSizeId, productSizes.id),
          )
          .where(eq(basketItems.basketId, basket.id));

        console.log("Found basket items:", basketItemsWithProducts.length);

        if (basketItemsWithProducts.length === 0) {
          console.error("Empty basket for user:", userId);
          throw new OrderError("EMPTY_BASKET", "Empty basket for user");
        }

        console.log("Creating order...");
        const [newOrder] = await tx
          .insert(orders)
          .values({ userId })
          .returning();

        if (!newOrder?.id) {
          console.error("Failed to create order");
          throw new OrderError(
            "ORDER_CREATION_FAILED",
            "Failed to create order",
          );
        }

        console.log("Creating order items...");
        const orderItemValues = basketItemsWithProducts.map(
          ({ basketItem }) => ({
            orderId: newOrder.id,
            productSizeId: basketItem.productSizeId,
            quantity: basketItem.quantity,
          }),
        );

        console.log(
          "Order items to create:",
          JSON.stringify(orderItemValues, null, 2),
        );

        const orderItemsResult = await tx
          .insert(orderItems)
          .values(orderItemValues)
          .returning();

        console.log(
          "Created order items:",
          JSON.stringify(orderItemsResult, null, 2),
        );

        if (!orderItemsResult.length) {
          console.error("Failed to create order items");
          throw new OrderError(
            "ORDER_ITEMS_CREATION_FAILED",
            "Failed to create order items",
          );
        }

        console.log("Clearing basket...");
        const deleteResult = await tx
          .delete(basketItems)
          .where(eq(basketItems.basketId, basket.id))
          .returning();

        console.log("Deleted basket items:", deleteResult.length);

        if (!deleteResult.length) {
          console.error("Failed to clear basket");
          throw new OrderError("BASKET_CLEAR_FAILED", "Failed to clear basket");
        }

        console.log("Order created successfully:", newOrder.id);
        return newOrder;
      } catch (error: unknown) {
        console.error("Order creation error:", error);
        if (error instanceof OrderError) throw error;

        if (error instanceof Error) {
          throw new OrderError("TRANSACTION_FAILED", error.message);
        }
        throw new OrderError("UNKNOWN_ERROR", "An unknown error occurred");
      }
    });
  },
  delete: async (orderId: number) => {
    return await db.delete(orders).where(eq(orders.id, orderId)).returning();
  },
} as const;
