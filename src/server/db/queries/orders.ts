import { and, desc, eq } from "drizzle-orm";
import { db } from "..";

export const orderQueries = {
  checkOrderBelongsToUser: async (orderId: number, userId: string) => {
    const order = await db.query.orders.findFirst({
      where: (orders) => and(eq(orders.id, orderId), eq(orders.userId, userId)),
    });
    return !!order;
  },

  getOrdersByUserId: async (userId: string) => {
    return await db.query.orders.findMany({
      where: (orders) => eq(orders.userId, userId),
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
      orderBy: (orders) => [desc(orders.createdAt)],
    });
  },

  getOrderByIdAndUserId: async (orderId: number, userId: string) => {
    return await db.query.orders.findFirst({
      where: (orders) => and(eq(orders.id, orderId), eq(orders.userId, userId)),
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

  getOrderById: async (orderId: number) => {
    return await db.query.orders.findFirst({
      where: (orders) => eq(orders.id, orderId),
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

export type OrderWithDetails = NonNullable<
  Awaited<ReturnType<typeof orderQueries.getOrderById>>
>;
