"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useCart } from "./cart-context";
import { useRouter } from "next/navigation";
import { createUrl } from "~/lib/utils";
import Link from "next/link";
import { CartItems } from "./cart-items";

export const CartModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const { cart } = useCart();

  if (!cart) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {cart ? cart.items.length : 0}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] px-0 sm:w-[540px]">
        <SheetHeader className="px-4">
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            Review your items and checkout when you're ready.
          </SheetDescription>
        </SheetHeader>
        <CartItems onItemClick={() => setIsOpen(false)} />
        <div className="mt-8 space-y-4 px-4">
          <Button
            onClick={() => {
              router.push("/checkout");
              setIsOpen(false);
            }}
            className="w-full"
          >
            Go to checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
