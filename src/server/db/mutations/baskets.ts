import { db } from "..";
import { eq, inArray, sql } from "drizzle-orm";
import { baskets, basketItems } from "../schema";

export class BasketError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "BasketError";
  }
}

export type AddBasketItemInput = {
  productSizeId: number;
  quantity: number;
};

export const basketMutations = {
  create: async (userId: string) => {
    if (!userId) throw new BasketError("INVALID_INPUT", "User ID is required");

    try {
      return await db.insert(baskets).values({ userId }).returning();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BasketError("CREATE_FAILED", error.message);
      }
      throw new BasketError("UNKNOWN_ERROR", "An unknown error occurred");
    }
  },

  addItems: async (basketId: number, lines: AddBasketItemInput[]) => {
    if (!basketId)
      throw new BasketError("INVALID_INPUT", "Basket ID is required");
    if (!lines.length)
      throw new BasketError("INVALID_INPUT", "At least one item is required");

    try {
      const values = lines.map((line) => ({
        basketId,
        productSizeId: line.productSizeId,
        quantity: line.quantity,
      }));

      return await db
        .insert(basketItems)
        .values(values)
        .onConflictDoUpdate({
          target: [basketItems.basketId, basketItems.productSizeId],
          set: { quantity: sql` EXCLUDED.quantity` },
        });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BasketError("ADD_ITEMS_FAILED", error.message);
      }
      throw new BasketError("UNKNOWN_ERROR", "An unknown error occurred");
    }
  },

  removeItems: async (basketItemIds: number[]) => {
    if (basketItemIds.length === 1 && basketItemIds[0]) {
      return await db
        .delete(basketItems)
        .where(eq(basketItems.id, basketItemIds[0]))
        .returning();
    }
    return await db
      .delete(basketItems)
      .where(inArray(basketItems.id, basketItemIds))
      .returning();
  },

  updateItems: async (lines: { id: number; quantity: number }[]) => {
    const updates = lines.map((line) =>
      db
        .update(basketItems)
        .set({ quantity: line.quantity })
        .where(eq(basketItems.id, line.id)),
    );

    return await db.transaction(async (tx) => {
      return Promise.all(updates.map((update) => tx.execute(update)));
    });
  },
} as const;

export type BasketMutationResult<T> = Promise<T>;
