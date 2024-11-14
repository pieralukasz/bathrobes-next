import { getUser } from "~/lib/supabase/server";
import { getOrdersByUserId } from "~/server/db/queries/orders";
import { OrdersList } from "~/features/orders/orders-list";

export default async function OrdersPage() {
  const user = await getUser();
  if (!user?.id) return null;

  const orders = await getOrdersByUserId(user.id);

  return <OrdersList orders={orders} />;
}
