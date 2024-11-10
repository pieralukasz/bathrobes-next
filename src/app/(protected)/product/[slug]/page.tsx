import { notFound } from "next/navigation";
import { ProductDetails } from "~/features/product/product-details";
import { getProductBySlug } from "~/server/db/queries/product";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
