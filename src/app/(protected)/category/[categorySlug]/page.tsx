import { ProductsList } from "~/features/products/components/products-list";
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

  if (category.products.length === 1 && category.products[0]?.slug) {
    redirect(`/product/${category.products[0].slug}`);
  }

  return <ProductsList categoryId={category.id} />;
}
