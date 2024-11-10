import { eq } from "drizzle-orm";
import { db } from "..";
import { basketItems, baskets } from "../schema";

// Add an item to the cart
export async function addItemToCart(
  basketId: number,
  productSizeId: number,
  quantity: number,
) {
  return await db
    .insert(basketItems)
    .values({ basketId, productSizeId, quantity })
    .returning();
}

// Update the quantity of an item in the cart
export async function updateCartItem(basketItemId: number, quantity: number) {
  return await db
    .update(basketItems)
    .set({ quantity })
    .where(eq(basketItems.id, basketItemId))
    .returning();
}

// Remove an item from the cart
export async function removeItemFromCart(basketItemId: number) {
  return await db.delete(basketItems).where(eq(basketItems.id, basketItemId));
}

// Clear all items from a cart
export async function clearCart(basketId: number) {
  return await db.delete(basketItems).where(eq(basketItems.basketId, basketId));
}
