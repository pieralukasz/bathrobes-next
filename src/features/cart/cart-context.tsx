"use client";

import {
  createContext,
  use,
  useContext,
  useMemo,
  useOptimistic,
  useTransition,
} from "react";
import {
  CartWithDetails,
  CartWithDetailsItem,
} from "~/server/db/queries/carts";
import { ProductWithDetails } from "~/server/db/queries/products";
import { InferProductSize } from "~/server/db/schema";

type UpdateType = "plus" | "minus" | "delete" | "clear";

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
        product: ProductWithDetails;
      };
    }
  | {
      type: "DELETE_ITEM";
      payload: {
        basketItemId: number;
      };
    }
  | {
      type: "CLEAR_CART";
    };

type CartContextType = {
  cart: CartWithDetails | undefined;
  updateCartItem: (basketItemId: number, updateType: UpdateType) => void;
  addCartItem: (
    productSizeId: number,
    quantity: number,
    productSize: InferProductSize,
    product: ProductWithDetails,
  ) => void;
  deleteCartItem: (basketItemId: number) => void;
  clearCart: () => void;
  isPending: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function createEmptyCart(userId: string): CartWithDetails {
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
  state: CartWithDetails | undefined,
  action: CartAction,
): CartWithDetails {
  if (!state) {
    return createEmptyCart("");
  }

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { basketItemId, updateType } = action.payload;

      const updatedItems = state.items
        .map((item) => {
          if (item.id !== basketItemId) return item;

          if (updateType === "delete") return null;

          const newQuantity =
            updateType === "plus" ? item.quantity + 1 : item.quantity - 1;

          // Prevent negative quantities
          if (newQuantity <= 0) return null;

          return {
            ...item,
            quantity: newQuantity,
            updatedAt: new Date(),
          };
        })
        .filter(Boolean) as CartWithDetailsItem[];

      return {
        ...state,
        items: updatedItems,
        updatedAt: new Date(),
      };
    }

    case "ADD_ITEM": {
      const { productSizeId, quantity, productSize, product } = action.payload;

      if (quantity <= 0) {
        throw new Error("Quantity must be positive");
      }

      if (!product) {
        throw new Error("Product is required");
      }

      const color = product.colors.find(
        (color) => color.id === productSize.colorId,
      );

      if (!color) {
        throw new Error(`Color not found for ID: ${productSize.colorId}`);
      }

      const existingItem = state.items.find(
        (item) => item.productSizeId === productSizeId,
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.productSizeId === productSizeId
              ? { ...item, quantity, updatedAt: new Date() }
              : item,
          ),
          updatedAt: new Date(),
        };
      }

      const tempId = Date.now() + Math.random();

      const newItem: CartWithDetailsItem = {
        id: tempId,
        basketId: state.id,
        productSizeId,
        quantity,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        productSize: {
          ...productSize,
          color: {
            ...color,
            product,
          },
        },
      };

      return {
        ...state,
        items: [...state.items, newItem],
        updatedAt: new Date(),
      };
    }

    case "DELETE_ITEM": {
      const { basketItemId } = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== basketItemId),
      };
    }

    case "CLEAR_CART": {
      return {
        ...state,
        items: [],
        updatedAt: new Date(),
      };
    }

    default:
      return state;
  }
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<CartWithDetails | undefined>;
}) {
  const initialCart = use(cartPromise);

  console.log(initialCart);
  const [isPending, startTransition] = useTransition();
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer,
  );

  const updateCartItem = (basketItemId: number, updateType: UpdateType) => {
    startTransition(() => {
      updateOptimisticCart({
        type: "UPDATE_ITEM",
        payload: { basketItemId, updateType },
      });
    });
  };

  const deleteCartItem = (basketItemId: number) => {
    startTransition(() => {
      updateOptimisticCart({
        type: "DELETE_ITEM",
        payload: { basketItemId },
      });
    });
  };

  const addCartItem = (
    productSizeId: number,
    quantity: number,
    productSize: InferProductSize,
    product: ProductWithDetails,
  ) => {
    startTransition(() => {
      updateOptimisticCart({
        type: "ADD_ITEM",
        payload: { productSizeId, quantity, productSize, product },
      });
    });
  };

  const clearCart = () => {
    startTransition(() => {
      updateOptimisticCart({
        type: "CLEAR_CART",
      });
    });
  };

  const value = useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      deleteCartItem,
      addCartItem,
      clearCart,
      isPending,
    }),
    [optimisticCart, isPending],
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
