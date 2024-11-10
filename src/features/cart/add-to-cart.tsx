import { InferProductSize } from "~/server/db/schema";
import { useCart } from "./cart-context";
import { addToCartAction } from "./actions";
import { useAction } from "next-safe-action/hooks";

interface AddToCartProps {
  productSize: InferProductSize;
  quantity: number;
}

export function AddToCart({ productSize, quantity }: AddToCartProps) {
  const { cart, addCartItem } = useCart();

  const { execute, result } = useAction(addToCartAction);

  return (
    <form
      action={() => {
        addCartItem(productSize.id, quantity, productSize);
        execute({ productSizeId: productSize.id, quantity });
      }}
    >
      <button className="mt-4">Add to cart</button>
      {result.data?.success ? (
        <p>{result.data.success}</p>
      ) : (
        <p>{result.data?.error}</p>
      )}
    </form>
  );
}
