import {
  unstable_cacheTag as cacheTag,
  unstable_cacheLife as cacheLife,
} from "next/cache";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";

export const CategoriesList = async () => {
  "use cache";
  cacheTag("categories");

  const categories = await db.query.categories.findMany({
    orderBy: (categories, { desc }) => [desc(categories.createdAt)],
  });

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {categories.map((category) => (
        <Button
          key={category.id}
          asChild
          variant="outline"
          className="px-6 py-3 text-lg font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Link href={`/category/${category.id}`}>{category.name}</Link>
        </Button>
      ))}
    </div>
  );
};
