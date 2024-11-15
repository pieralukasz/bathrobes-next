"use client";

import { useAction } from "next-safe-action/hooks";
import { useCart } from "./cart-context";
import { checkoutAction } from "./actions";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { AlertCircle, Loader2, ShoppingBag } from "lucide-react";
import { cn } from "~/lib/utils";

export const CreateOrder = () => {
  const { cart } = useCart();
  const { executeAsync, status } = useAction(checkoutAction);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  if (!cart) {
    return null;
  }

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      return;
    }

    try {
      setError(null);
      console.log("ELO");
      const result = await executeAsync();

      console.log(result);

      if (result?.data?.error) {
        const errorMessages: Record<string, string> = {
          "No basket found":
            "Your session has expired. Please refresh the page.",
          "Cannot create order with empty basket":
            "Your cart is empty. Please add items before checking out.",
          "Failed to create order":
            "Unable to process your order. Please try again.",
          "Failed to create order items":
            "Unable to process your items. Please try again.",
          "Authentication error": "Please log in to complete your order.",
        };

        setError(
          errorMessages[result.data.error] ||
            "An unexpected error occurred. Please try again.",
        );
        return;
      }

      if (result?.data?.success) {
        router.push("/thank-you");
        router.refresh();
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="mb-2 flex items-center gap-2 text-center">
        <ShoppingBag className="h-5 w-5" />
        <span>You'll receive an email with your order details.</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-center text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
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
