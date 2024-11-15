import { InferProductSize } from "~/server/db/schema";
import { useCart } from "./cart-context";
import { addToCartAction } from "./actions";
import { useAction } from "next-safe-action/hooks";
import { ProductWithDetails } from "~/server/db/queries/products";

interface AddToCartProps {
  product: ProductWithDetails;
  size: InferProductSize;
  quantity: number;
}

export function AddToCart({ size, product, quantity }: AddToCartProps) {
  const { addCartItem } = useCart();

  const { execute, result } = useAction(addToCartAction);

  return (
    <form
      action={() => {
        addCartItem(size.id, quantity, size, product);
        execute({ productSizeId: size.id, quantity });
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
