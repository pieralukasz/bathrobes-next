import { and, desc, eq } from "drizzle-orm";
import { db } from "..";

export async function checkOrderBelongsToUser(orderId: number, userId: string) {
  const order = await db.query.orders.findFirst({
    where: (orders) => and(eq(orders.id, orderId), eq(orders.userId, userId)),
  });
  return !!order;
}

export async function getOrdersByUserId(userId: string) {
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
}

export async function getOrderByIdAndUserId(orderId: number, userId: string) {
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
}

export async function getOrderById(orderId: number) {
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
}
