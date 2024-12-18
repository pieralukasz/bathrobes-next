"use server";

import { InferBasket } from "~/server/db/schema";

import { actionClient } from "~/lib/safe-action";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "~/lib/constants";
import { addToCartSchema, updateCartSchema, removeItemSchema } from "./schema";
import { basketMutations } from "~/server/db/mutations";
import { basketQueries } from "~/server/db/queries";
import { getUser as getUserSupabase } from "~/lib/supabase/server";

const getUser = async () => {
  try {
    const user = await getUserSupabase();
    if (!user) throw new Error("Not authenticated");
    return user;
  } catch (e) {
    throw new Error("Not authenticated");
  }
};

export const getCart = async (userId: string) => {
  try {
    const cart = await basketQueries.getByUserId(userId);
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

      let cart: InferBasket | undefined = await basketQueries.getByUserId(
        user.id,
      );

      if (!cart) {
        const [newCart] = await basketMutations.create(user.id);
        cart = newCart as InferBasket;
      }

      await basketMutations.addItems(cart.id, [{ productSizeId, quantity }]);
      revalidateTag(CACHE_TAGS.cart);
      revalidateTag(CACHE_TAGS.orders);
      return { success: true };
    } catch (e) {
      console.error(e);
      return { error: "Error adding item to cart" };
    }
  });

export const createCartAction = actionClient.action(async () => {
  try {
    const user = await getUser();
    await basketMutations.create(user.id);
    revalidateTag(CACHE_TAGS.cart);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Error creating cart" };
  }
});

export const removeItemAction = actionClient
  .schema(removeItemSchema)
  .action(async ({ parsedInput: { basketItemId } }) => {
    try {
      const user = await getUser();

      await getCart(user.id);

      await basketMutations.removeItems([basketItemId]);
      revalidateTag(CACHE_TAGS.cart);
      revalidateTag(CACHE_TAGS.orders);
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
        await basketMutations.removeItems([basketItemId]);
      } else {
        await basketMutations.updateItems([{ id: basketItemId, quantity }]);
      }

      revalidateTag(CACHE_TAGS.cart);
      revalidateTag(CACHE_TAGS.orders);

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
    await basketMutations.removeItems(basketItemIds);

    revalidateTag(CACHE_TAGS.cart);
    revalidateTag(CACHE_TAGS.orders);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Error clearing cart" };
  }
});
