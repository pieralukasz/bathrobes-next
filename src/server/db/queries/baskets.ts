import { db } from "..";
import { eq } from "drizzle-orm";

export const basketQueries = {
  getByUserId: async (userId: string) => {
    if (!userId) throw new Error("User ID is required");

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
  },
} as const;

export type BasketWithDetails = NonNullable<
  Awaited<ReturnType<typeof basketQueries.getByUserId>>
>;
export type BasketWithDetailsItem = BasketWithDetails["items"][number];
