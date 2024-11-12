"use client";

import Link from "next/link";
import { useCart } from "./cart-context";
import { createUrl } from "~/lib/utils";

interface CartItemsProps {
  onItemClick?: () => void;
}

export const CartItems = ({ onItemClick }: CartItemsProps) => {
  const { cart } = useCart();

  if (!cart) {
    return null;
  }

  return (
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
                  onClick={onItemClick}
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
  );
};
