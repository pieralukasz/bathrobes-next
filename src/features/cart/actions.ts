"use server";

import { actionClient } from "~/lib/safe-action";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "~/lib/constants";
import { addToCartSchema, updateCartSchema, removeItemSchema } from "./schema";
import {
  addToCart,
  createCart,
  removeFromCart,
  updateCart,
} from "~/server/db/mutations/cart";
import { getCart as getExistingCart } from "~/server/db/queries/cart";
import type { InferBasket } from "~/server/db/schema";
import { getUser as getUserSupabase } from "~/lib/supabase/server";
import { createOrder } from "~/server/db/mutations/orders";

const getUser = async () => {
  try {
    const user = await getUserSupabase();
    if (!user) throw new Error("Not authenticated");
    return user;
  } catch (e) {
    throw new Error("Not authenticated");
  }
};

const getCart = async (userId: string) => {
  try {
    const cart = await getExistingCart(userId);
    if (!cart) throw new Error("Cart not found");
    return cart;
  } catch (e) {
    throw new Error("Error getting cart");
  }
};

export const addToCartAction = actionClient
  .schema(addToCartSchema)
  .action(async ({ parsedInput: { productSizeId, quantity } }) => {
    try {
      const user = await getUser();

      let cart: InferBasket | undefined = await getExistingCart(user.id);

      if (!cart) {
        const [newCart] = await createCart(user.id);
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
    try {
      const user = await getUser();

      await getCart(user.id);

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
    try {
      const user = await getUser();
      await getCart(user.id);

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
  try {
    const user = await getUser();
    const cart = await getCart(user.id);

    const basketItemIds = cart.items.map((item) => item.id);
    await removeFromCart(basketItemIds);
    revalidateTag(CACHE_TAGS.cart);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Error clearing cart" };
  }
});

export const checkoutAction = actionClient.action(async () => {
  try {
    const user = await getUser();
    await getCart(user.id);
    await createOrder(user.id);

    revalidateTag(CACHE_TAGS.cart);

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Error checking out" };
  }
});
