import { db } from "..";
import { baskets, basketItems, productSizes, products } from "../schema";

// Fetch all items in a cart
export async function getCartItems(basketId: number) {
  return await db.query.basketItems.findMany({
    where: (basketItems) => eq(basketItems.basketId, basketId),
    with: {
      productSize: {
        with: {
          color: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
}

// Fetch a single cart by user ID
export async function getCartByUserId(userId: string) {
  return await db.query.baskets.findFirst({
    where: (baskets) => eq(baskets.userId, userId),
    with: {
      items: {
        with: {
          productSize: {
            with: {
              color: {
                with: {
                  product: true,
                },
              },
            },
          },
        },
      },
    },
  });
}
