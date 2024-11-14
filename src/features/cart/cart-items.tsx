"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useCart } from "./cart-context";
import { cn, createUrl } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { removeItemAction } from "./actions";

interface CartItemsProps {
  onItemClick?: () => void;
}

export const CartItems = ({ onItemClick }: CartItemsProps) => {
  const { cart, deleteCartItem } = useCart();

  const { execute, status } = useAction(removeItemAction);

  if (!cart) {
    return null;
  }

  const handleRemove = async (e: React.MouseEvent, basketItemId: number) => {
    e.preventDefault();
    e.stopPropagation();

    deleteCartItem(basketItemId);
    execute({ basketItemId });
  };

  return (
    <div className="flex h-[calc(100%-128px)] flex-col justify-between overflow-hidden">
      <ul className="mb-2 flex-grow overflow-auto p-4">
        {cart.items.map((product, i) => {
          const params = new URLSearchParams({
            color: product.productSize.color.color,
            size: product.productSize.size,
          });

          const productUrl = createUrl(
            `/product/${product.productSize.color.product.slug}`,
            params,
          );

          return (
            <li
              key={i}
              className={cn(
                "flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700",
                i === cart.items.length - 1 ? "border-b-0" : "",
              )}
            >
              <div className="relative flex w-full justify-between px-1 py-4">
                <Link
                  href={productUrl}
                  onClick={onItemClick}
                  className="flex flex-row items-center justify-start"
                >
                  <div className="relative w-16 border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                    <img
                      src="https://alfxflqvzegvbpsvtzih.supabase.co/storage/v1/object/public/photos/2018_patti_grafit.png"
                      // alt={product.productSize.color.imageUrl}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -left-2 -top-2 h-6 w-6 rounded-full border border-neutral-300 bg-white shadow hover:bg-red-50 dark:border-neutral-700 dark:hover:bg-red-800"
                      onClick={(e) => handleRemove(e, product.id)}
                      disabled={status === "executing"}
                    >
                      <X className="h-4 w-4" />
                    </Button>
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
  );
};
