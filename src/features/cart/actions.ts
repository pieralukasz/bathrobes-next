"use server";

import { actionClient } from "~/lib/safe-action";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "~/lib/constants";
import { addToCartSchema, updateCartSchema, removeItemSchema } from "./schema";
import {
  addToCart,
  createCart,
  removeFromCart,
  updateCart,
} from "~/server/db/mutations/cart";
import { getCart } from "~/server/db/queries/cart";
import type { InferBasket } from "~/server/db/schema";

export const addToCartAction = actionClient
  .schema(addToCartSchema)
  .action(async ({ parsedInput: { productSizeId, quantity } }) => {
    const userId = (await cookies()).get("userId")?.value;
    if (!userId) return { error: "Not authenticated" };

    try {
      let cart: InferBasket | undefined = await getCart(userId);

      if (!cart) {
        const [newCart] = await createCart(userId);
        cart = newCart as InferBasket;
      }

      await addToCart(cart.id, [{ productSizeId, quantity }]);
      revalidateTag(CACHE_TAGS.cart);
      return { success: true };
    } catch (e) {
      console.error(e);
      return { error: "Error adding item to cart" };
    }
  });

export const removeItemAction = actionClient
  .schema(removeItemSchema)
  .action(async ({ parsedInput: { basketItemId } }) => {
    const userId = (await cookies()).get("userId")?.value;
    if (!userId) return { error: "Not authenticated" };

    try {
      const cart = await getCart(userId);
      if (!cart) return { error: "Cart not found" };

      await removeFromCart([basketItemId]);
      revalidateTag(CACHE_TAGS.cart);
      return { success: true };
    } catch (e) {
      console.error(e);
      return { error: "Error removing item from cart" };
    }
  });

export const updateItemQuantityAction = actionClient
  .schema(updateCartSchema)
  .action(async ({ parsedInput: { basketItemId, quantity } }) => {
    const userId = (await cookies()).get("userId")?.value;
    if (!userId) return { error: "Not authenticated" };

    try {
      const cart = await getCart(userId);
      if (!cart) return { error: "Cart not found" };

      if (quantity === 0) {
        await removeFromCart([basketItemId]);
      } else {
        await updateCart([{ id: basketItemId, quantity }]);
      }

      revalidateTag(CACHE_TAGS.cart);
      return { success: true };
    } catch (e) {
      console.error(e);
      return { error: "Error updating item quantity" };
    }
  });

export const clearCartAction = actionClient.action(async () => {
  const userId = (await cookies()).get("userId")?.value;
  if (!userId) return { error: "Not authenticated" };

  try {
    const cart = await getCart(userId);
    if (!cart) return { error: "Cart not found" };

    const basketItemIds = cart.items.map((item) => item.id);
    await removeFromCart(basketItemIds);
    revalidateTag(CACHE_TAGS.cart);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Error clearing cart" };
  }
});

export const redirectToCheckoutAction = actionClient.action(async () => {
  const userId = (await cookies()).get("userId")?.value;
  if (!userId) return { error: "Not authenticated" };

  const cart = await getCart(userId);
  if (!cart) return { error: "Cart not found" };

  redirect("/checkout");
});
