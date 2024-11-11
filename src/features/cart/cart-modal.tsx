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
import { createUrl } from "~/lib/utils";
import Link from "next/link";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

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
        <div className="flex h-[calc(100%-128px)] flex-col justify-between overflow-hidden">
          <ul className="mb-2 flex-grow overflow-auto p-4">
            {cart.items.map((product, i) => {
              const productUrl = createUrl(
                `/product/${product.productSize.color.product.slug}`,
                new URLSearchParams(),
              );

              return (
                <li
                  key={i}
                  className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                >
                  <div className="relative flex w-full justify-between px-1 py-4">
                    <Link
                      href={productUrl}
                      onClick={() => setIsOpen(false)}
                      className="flex flex-row items-center justify-start"
                    >
                      <div className="relative w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                        <img
                          src="https://alfxflqvzegvbpsvtzih.supabase.co/storage/v1/object/public/photos/2018_patti_grafit.png"
                          // alt={product.productSize.color.imageUrl}
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="ml-2 flex flex-row space-x-4">
                        <div className="flex flex-1 flex-col text-base">
                          <span className="font-bold">
                            {product.productSize.color.product.name}
                          </span>
                          <span className="text-sm">
                            {product.productSize.color.color}
                          </span>
                          <span className="text-sm">
                            {product.productSize.size}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="flex flex-row items-center justify-end">
                      <span className="mr-2 text-xl font-bold">
                        {product.quantity}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
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
