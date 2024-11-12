"use client";

import { useAction } from "next-safe-action/hooks";
import { useCart } from "./cart-context";
import { checkoutAction } from "./actions";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export const CreateOrder = () => {
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
    <>
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
    </>
  );
};
