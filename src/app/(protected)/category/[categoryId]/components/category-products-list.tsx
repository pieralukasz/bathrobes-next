import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import { products } from "~/server/db/schema";

interface CategoryProductsListProps {
  categoryId: string;
}

export const CategoryProductsList: React.FC<
  CategoryProductsListProps
> = async ({ categoryId }) => {
  const categoryProducts = await db.query.products.findMany({
    where: eq(products.categoryId, parseInt(categoryId)),
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
          <Link href={`/category/${product.id}`}>{product.name}</Link>
        </Button>
      ))}
    </div>
  );
};
