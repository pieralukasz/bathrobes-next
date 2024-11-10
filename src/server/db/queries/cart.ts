import { db } from "..";
import { eq } from "drizzle-orm";

import type { InferBasket } from "../schema";

export async function getCart(
  userId: string,
): Promise<InferBasket | undefined> {
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
