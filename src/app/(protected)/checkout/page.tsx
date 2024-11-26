import { redirect } from "next/navigation";
import { CartItems } from "~/features/cart/cart-items";

import { CreateOrder } from "~/features/orders/create-order";
import { getUser } from "~/lib/supabase/server";
import { basketQueries } from "~/server/db/queries";

export default async function CheckoutPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const cart = await basketQueries.getByUserId(user.id);

  if (!cart) {
    redirect("/search");
  }

  return (
    <div className="flex w-full flex-col px-4 sm:w-[540px]">
      <div className="px-4">
        <h2 className="font-bold">Are you ready to checkout?</h2>
        <p>Review your items and proceed to checkout when you're ready.</p>
      </div>
      <CartItems />
      <CreateOrder />
    </div>
  );
}
