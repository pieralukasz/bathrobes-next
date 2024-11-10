import { ProductsList } from "~/features/product/components/products-list";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { categories } from "~/server/db/schema";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const categorySlug = (await params).categorySlug;

  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, categorySlug),
    with: {
      products: true,
    },
  });

  if (!category) {
    notFound();
  }

  return <ProductsList categoryId={category.id} />;
}
