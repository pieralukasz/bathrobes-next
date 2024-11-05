import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import { products } from "~/server/db/schema";

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
    with: {
      colors: true,
    },
  });

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {categoryProducts.map((product) => (
        <Button
          key={product.id}
          asChild
          variant="outline"
          className="px-6 py-3 text-lg font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </Button>
      ))}
    </div>
  );
};
