import { Suspense } from "react";
import { FilterList } from "~/components/search";
import { cn } from "~/lib/utils";

import { productQueries } from "~/server/db/queries";

async function CategoriesList() {
  const categories = await productQueries.getCategories();

  const all = {
    title: "Wszystkie",
    path: "/search",
  };

  const mappedCategories = categories.map((category) => ({
    title: category.name,
    path: `/search/${category.slug}`,
  }));

  return <FilterList list={[all, ...mappedCategories]} title="Categories" />;
}

const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded";
const activeAndTitles = "bg-neutral-800 dark:bg-neutral-300";
const items = "bg-neutral-400 dark:bg-neutral-700";

export const Categories = () => {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={cn(skeleton, activeAndTitles)} />
          <div className={cn(skeleton, activeAndTitles)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
        </div>
      }
    >
      <CategoriesList />
    </Suspense>
  );
};
