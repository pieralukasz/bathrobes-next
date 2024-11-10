import { ShoppingBasket } from "lucide-react";

export const Basket = () => {
  return (
    <div className="flex items-center gap-2">
      <ShoppingBasket size={16} />
      <span>0</span>
    </div>
  );
};
