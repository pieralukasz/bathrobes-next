import { db } from "..";
import { orders, orderItems, productSizes, products } from "../schema";

// Fetch all orders for a user
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
  });
}

// Fetch a single order by ID
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
