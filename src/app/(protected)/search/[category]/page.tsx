import { notFound } from "next/navigation";
import { ProductsList } from "~/features/product/products-list";
import { defaultSort, sorting } from "~/lib/constants";

import { productQueries } from "~/server/db/queries/products";

// export async function generateMetadata(props: {
//   params: Promise<{ category: string }>;
// }): Promise<Metadata> {
//   const params = await props.params;
//   const category = await getCategory(params.category);

//   if (!category) return notFound();

//   return {
//     title: category.seo?.title || collection.title,
//     description:
//       collection.seo?.description || collection.description || `${collection.title} products`
//   };
// }

export default async function CategoryPage(props: {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const category = await productQueries.getCategory(params.category);

  if (!category) return notFound();

  const products = await productQueries.getProducts({
    categoryId: category.id,
    sortKey,
    reverse,
    searchValue,
  });

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">
          {searchValue
            ? `No products found in "${category.name}" for "${searchValue}"`
            : `No products found in "${category.name}"`}
        </p>
      ) : (
        <ProductsList products={products} />
      )}
    </section>
  );
}
