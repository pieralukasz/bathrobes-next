import { notFound } from "next/navigation";
import { ProductDetails } from "~/features/product/product-details";
import { productQueries } from "~/server/db/queries";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ ean: string | undefined }>;

export default async function ProductPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params.slug;
  const ean = searchParams.ean;

  const product = await productQueries.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetails key={ean} product={product} ean={ean} />;
}
