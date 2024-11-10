import { notFound } from "next/navigation";
import { ProductDetails } from "~/features/product/components/product/product-details";
import { getProductBySlug } from "~/server/db/queries/product";

export default async function Page({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const productSlug = (await params).productSlug;

  const product = await getProductBySlug(productSlug);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
