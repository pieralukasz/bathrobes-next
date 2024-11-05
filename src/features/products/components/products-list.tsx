import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { ProductCard } from "./product/product-card";

interface ProductsListProps {
  categoryId: number;
}

export const ProductsList: React.FC<ProductsListProps> = async ({
  categoryId,
}) => {
  if (Number.isNaN(categoryId)) {
    notFound();
  }

  const categoryProducts = await db.query.products.findMany({
    where: eq(products.categoryId, categoryId),
  });

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categoryProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};
