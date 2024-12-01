import { SortKey, productQueries } from "../../server/db/queries";
import { ProductCard } from "./product-card";

interface ProductsListProps {
  sortKey: SortKey | undefined;
  reverse: boolean;
  searchValue: string | undefined;
  categoryId: number | undefined;
}

export const ProductsList: React.FC<ProductsListProps> = async ({
  sortKey,
  reverse,
  searchValue,
  categoryId,
}) => {
  // "use cache";

  const products = await productQueries.getProducts({
    categoryId,
    sortKey,
    reverse,
    searchValue,
  });

  const visibleProducts = products.filter(
    (product) => product.category.visible,
  );

  return visibleProducts.length === 0 ? (
    <p className="py-3 text-lg">
      {searchValue
        ? `No products found for "${searchValue}"`
        : "No products found"}
    </p>
  ) : (
    <div className="container mx-auto w-full px-4">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {visibleProducts.map((product) => (
          <ProductCard product={product} key={product?.id} />
        ))}
      </div>
    </div>
  );
};
