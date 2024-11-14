import Link from "next/link";
import { getOrderByIdAndUserId } from "~/server/db/queries/orders";

interface OrdersListProps {
  orders: NonNullable<Awaited<ReturnType<typeof getOrderByIdAndUserId>>>[];
}

export function OrdersList({ orders }: OrdersListProps) {
  if (!orders.length) {
    return <p className="text-lg">No orders found</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Your Orders</h1>
      <div className="w-full space-y-4 overflow-y-auto px-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block rounded-lg border border-neutral-200 p-4 transition hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-neutral-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="font-medium">{order.items.length} items</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
