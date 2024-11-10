import Link from "next/link";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";

export const CategoriesList = async () => {
  const categories = await db.query.categories.findMany({
    orderBy: (categories, { desc }) => [desc(categories.createdAt)],
    with: {
      products: true,
    },
  });

  return (
    <div className="flex flex-wrap justify-center gap-4 pt-5">
      {categories.map((category) => (
        <Button
          key={category.id}
          asChild
          variant="outline"
          className="px-6 py-3 text-lg font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Link
            href={
              category.products.length === 1 && category.products[0]
                ? `/product/${category.products[0].slug}`
                : `/category/${category.slug}`
            }
          >
            {category.name}
          </Link>
        </Button>
      ))}
    </div>
  );
};
