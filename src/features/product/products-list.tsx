import { ProductCard } from "./product-card";
import { ProductWithDetails } from "./product-details";

interface ProductsListProps {
  products: ProductWithDetails[];
}

export const ProductsList: React.FC<ProductsListProps> = async ({
  products,
}) => {
  return (
    <div className="container mx-auto w-full px-4">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard product={product} key={product?.id} />
        ))}
      </div>
    </div>
  );
};
