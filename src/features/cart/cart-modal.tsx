"use client";

import { useState, useTransition } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
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

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

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
      <SheetContent className="w-[90vw] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            Review your items and checkout when you're ready.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {cart.items.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <span className="font-medium">
                {product.productSize.color.product.name}
              </span>
              <span className="font-medium">{product.productSize.size}</span>
              <span className="font-medium">{product.productSize.ean}</span>
              <div className="flex items-center space-x-2">
                <span>{product.quantity}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-4">
          <Button
            onClick={() => {
              router.push("/checkout");
              setIsOpen(false);
            }}
            className="w-full"
          >
            Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
