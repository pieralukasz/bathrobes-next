import { notFound } from "next/navigation";
import { orderQueries } from "~/server/db/queries";
import { OrderItems } from "~/features/orders/order-items";
import { getUser } from "~/lib/supabase/server";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const user = await getUser();

  const paramsAwaited = await params;
  if (!user?.id) return null;

  const order = await orderQueries.getOrderByIdAndUserId(
    parseInt(paramsAwaited.orderId),
    user.id,
  );

  if (!order || order.userId !== user?.id) {
    return notFound();
  }

  return (
    <div className="flex w-full flex-col px-4 sm:w-[540px]">
      <div className="px-4">
        <h2 className="font-bold">Order number #{order.id}</h2>
        <p className="text-neutral-500">
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>
      <OrderItems items={order.items} />
    </div>
  );
}
