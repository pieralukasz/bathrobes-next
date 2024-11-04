import { db } from "~/server/db";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Button } from "~/components/ui/button";

const getCategories = unstable_cache(
  async () => {
    return await db.query.categories.findMany({
      orderBy: (categories, { desc }) => [desc(categories.createdAt)],
    });
  },
  ["categories"],
  {
    revalidate: 3600,
    tags: ["categories"],
  },
);

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto w-full">
      <h1 className="mb-6 text-center text-3xl font-bold">Categories</h1>
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
    </div>
  );
}
