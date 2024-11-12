"use client";
import { Button } from "~/components/ui/button";
import { CartItems } from "~/features/cart/cart-items";
import { useCart } from "~/features/cart/cart-context";
import { useAction } from "next-safe-action/hooks";
import { checkoutAction } from "~/features/cart/actions";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart } = useCart();
  const { execute, result } = useAction(checkoutAction);
  const router = useRouter();

  if (!cart) {
    return null;
  }

  const handleCheckout = async () => {
    try {
      execute();
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex w-full flex-col px-4 sm:w-[540px]">
      <div className="px-4">
        <h2 className="font-bold">Are you ready to checkout?</h2>
        <p>Review your items and proceed to checkout when you're ready.</p>
      </div>
      <CartItems />
      <span className="text-center">
        You'll receive an email with your order details.
      </span>
      {result.data?.error && (
        <p className="text-center text-red-500">{result.data.error}</p>
      )}
      <div className="flex justify-center py-4">
        <Button onClick={handleCheckout} className="w-[320px]">
          Order now
        </Button>
      </div>
    </div>
  );
}
