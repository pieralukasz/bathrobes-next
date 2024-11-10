import { db } from "..";
import { eq } from "drizzle-orm";

export async function getCart(userId: string) {
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

export type CartWithDetails = NonNullable<Awaited<ReturnType<typeof getCart>>>;
export type CartWithDetailsItem = CartWithDetails["items"][number];

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
