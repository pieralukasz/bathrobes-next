import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { products } from "~/server/db/schema";
import { notFound } from "next/navigation";
import { ProductDetails } from "~/features/products/components/product/product-details";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const productSlug = (await params).productSlug;

  const product = await db.query.products.findFirst({
    where: eq(products.slug, productSlug),
    with: {
      category: true,
      colors: {
        with: {
          sizes: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
