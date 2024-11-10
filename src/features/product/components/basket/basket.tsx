"use client";

import { ShoppingBasket } from "lucide-react";
import { useCart } from "~/features/cart/cart-context";

export const Basket = () => {
  const { cart } = useCart();

  console.log(cart, "BAKSET");

  return (
    <div className="flex items-center gap-2">
      <ShoppingBasket size={16} />
      <span>{cart?.items.length || 0}</span>
    </div>
  );
};
