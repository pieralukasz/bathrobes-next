import { getUser } from "~/lib/supabase/server";
import { orderQueries } from "~/server/db/queries";
import { OrdersList } from "~/features/orders/orders-list";

export default async function OrdersPage() {
  const user = await getUser();
  if (!user?.id) return null;

  const orders = await orderQueries.getOrdersByUserId(user.id);

  return <OrdersList orders={orders} />;
}
