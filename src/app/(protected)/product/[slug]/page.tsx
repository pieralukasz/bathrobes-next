import { notFound } from "next/navigation";
import { ProductDetails } from "~/features/product/product-details";
import { getProductBySlug } from "~/server/db/queries/product";

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: { color?: string; size?: string };
}) {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);

  const { color, size } = searchParams;

  if (!product) {
    notFound();
  }

  return (
    <ProductDetails
      key={`${color}-${size}`}
      product={product}
      defaultColor={color}
      defaultSize={size}
    />
  );
}
