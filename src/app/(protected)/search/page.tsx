import { ProductsList } from "~/features/product/products-list";
import { defaultSort, sorting } from "~/lib/constants";
import { getProducts } from "~/server/db/queries/product";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  console.log(searchValue, sort);

  const products = await getProducts({});

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <ProductsList products={products} />
      )}
    </section>
  );
}
