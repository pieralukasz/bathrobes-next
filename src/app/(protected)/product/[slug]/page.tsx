import { notFound } from "next/navigation";
import { ProductDetails } from "~/features/product/product-details";
import { productQueries } from "~/server/db/queries";

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: { color?: string; size?: string };
}) {
  const slug = (await params).slug;
  const product = await productQueries.getProductBySlug(slug);

  const searchedParams = await searchParams;

  if (!product) {
    notFound();
  }

  const color = searchedParams?.color || product.colors[0]?.color;
  const size = searchedParams?.size || product.colors[0]?.sizes[0]?.size;

  if (!color || !size) {
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
