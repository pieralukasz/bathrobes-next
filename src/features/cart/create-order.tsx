"use client";

import { useAction } from "next-safe-action/hooks";
import { useCart } from "./cart-context";
import { checkoutAction } from "./actions";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { AlertCircle, Loader2, ShoppingBag } from "lucide-react";
import { cn } from "~/lib/utils";

export const CreateOrder = () => {
  const { cart } = useCart();
  const { executeAsync, status } = useAction(checkoutAction);
  const router = useRouter();

  if (!cart) {
    return null;
  }

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      return;
    }

    try {
      const result = await executeAsync();

      if (result?.data?.error) {
        return;
      }

      if (result?.data?.success) {
        router.push("/thank-you");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="mb-2 flex items-center gap-2 text-center">
        <ShoppingBag className="h-5 w-5" />
        <span>You'll receive an email with your order details.</span>
      </div>

      {status === "hasErrored" && (
        <div className="flex items-center gap-2 text-center text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p>{status === "hasErrored" ? "An error occurred" : ""}</p>
        </div>
      )}

      {status === "executing" && (
        <div className="flex items-center gap-2 text-center text-blue-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Processing your order...</p>
        </div>
      )}

      <div className="flex justify-center py-4">
        <Button
          onClick={handleCheckout}
          className={cn("w-[320px] transition-all duration-200")}
          disabled={status === "executing"}
        >
          {status === "executing" ? "Processing..." : "Complete Order"}
        </Button>
      </div>
    </div>
  );
};
