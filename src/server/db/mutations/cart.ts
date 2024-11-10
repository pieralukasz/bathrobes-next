import { db } from "..";
import { eq, inArray } from "drizzle-orm";
import { baskets, basketItems } from "../schema";

export async function createCart(userId: string) {
  return await db.insert(baskets).values({ userId }).returning();
}

export async function addToCart(
  basketId: number,
  lines: { productSizeId: number; quantity: number }[],
) {
  return await db
    .insert(basketItems)
    .values(
      lines.map((line) => ({
        basketId,
        productSizeId: line.productSizeId,
        quantity: line.quantity,
      })),
    )
    .returning();
}

export async function removeFromCart(basketItemIds: number[]) {
  if (basketItemIds.length === 1 && basketItemIds[0]) {
    return await db
      .delete(basketItems)
      .where(eq(basketItems.id, basketItemIds[0]))
      .returning();
  } else {
    return await db
      .delete(basketItems)
      .where(inArray(basketItems.id, basketItemIds))
      .returning();
  }
}
export async function updateCart(lines: { id: number; quantity: number }[]) {
  const updates = lines.map((line) =>
    db
      .update(basketItems)
      .set({ quantity: line.quantity })
      .where(eq(basketItems.id, line.id)),
  );

  return await db.transaction(async (tx) => {
    return Promise.all(updates.map((update) => tx.execute(update)));
  });
}
