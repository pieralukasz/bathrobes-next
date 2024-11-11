import { notFound } from "next/navigation";
import { ProductsList } from "~/features/product/products-list";

// import { defaultSort, sorting } from 'lib/constants';
import { getCategory, getProducts } from "~/server/db/queries/product";

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
  //   const searchParams = await props.searchParams;
  const params = await props.params;
  //   const { sort } = searchParams as { [key: string]: string };
  //   const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const category = await getCategory(params.category);

  if (!category) return notFound();

  const products = await getProducts({ categoryId: category.id });

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
