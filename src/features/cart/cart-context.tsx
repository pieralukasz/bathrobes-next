"use client";

import { createContext, use, useContext, useMemo, useOptimistic } from "react";
import { InferProductSize } from "~/server/db/schema";
import type { InferBasket, InferBasketItem } from "~/server/db/schema/carts";

type UpdateType = "plus" | "minus" | "delete";

type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: {
        basketItemId: number;
        updateType: UpdateType;
      };
    }
  | {
      type: "ADD_ITEM";
      payload: {
        productSizeId: number;
        quantity: number;
        productSize: InferProductSize;
      };
    };

type CartContextType = {
  cart: InferBasket | undefined;
  updateCartItem: (basketItemId: number, updateType: UpdateType) => void;
  addCartItem: (
    productSizeId: number,
    quantity: number,
    productSize: InferBasketItem["productSize"],
  ) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function createEmptyCart(userId: string): InferBasket {
  return {
    id: 0,
    userId,
    items: [],
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  };
}

function cartReducer(
  state: InferBasket | undefined,
  action: CartAction,
): InferBasket {
  const currentCart = state || createEmptyCart("");

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { basketItemId, updateType } = action.payload;

      const updatedItems = currentCart.items
        .map((item) => {
          if (item.id !== basketItemId) return item;

          if (updateType === "delete") return null;

          const newQuantity =
            updateType === "plus" ? item.quantity + 1 : item.quantity - 1;

          if (newQuantity === 0) return null;

          return {
            ...item,
            quantity: newQuantity,
          };
        })
        .filter(Boolean) as InferBasketItem[];

      return {
        ...currentCart,
        items: updatedItems,
      };
    }

    case "ADD_ITEM": {
      const { productSizeId, quantity, productSize } = action.payload;
      const existingItem = currentCart.items.find(
        (item) => item.productSizeId === productSizeId,
      );

      console.log(existingItem);
      if (existingItem) {
        return {
          ...currentCart,
          items: currentCart.items.map((item) =>
            item.productSizeId === productSizeId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        };
      }

      const newItem: InferBasketItem = {
        id: Math.random(),
        basketId: currentCart.id,
        productSizeId,
        quantity,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        productSize,
      };

      return {
        ...currentCart,
        items: [...currentCart.items, newItem],
      };
    }

    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<InferBasket | undefined>;
}) {
  const initialCart = use(cartPromise);
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer,
  );

  const updateCartItem = (basketItemId: number, updateType: UpdateType) => {
    updateOptimisticCart({
      type: "UPDATE_ITEM",
      payload: { basketItemId, updateType },
    });
  };

  const addCartItem = (
    productSizeId: number,
    quantity: number,
    productSize: InferProductSize,
  ) => {
    updateOptimisticCart({
      type: "ADD_ITEM",
      payload: { productSizeId, quantity, productSize },
    });
  };

  console.log(optimisticCart, "CART");

  const value = useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
    }),
    [optimisticCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
