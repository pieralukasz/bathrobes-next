import { sorting } from "~/lib/constants";
import { ChildrenWrapper } from "./children-wrapper";
import { Categories } from "~/features/product/categories-list";
import { FilterList } from "~/components/search";
import { cn } from "~/lib/utils";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="b-4 mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-4 py-4 text-black dark:text-white md:flex-row">
        <div className="order-first w-full flex-none md:max-w-[125px]">
          <Categories />
        </div>
        <div className={cn(`w-full md:order-none`)}>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </div>
        <div className="order-none flex-none md:w-[125px]">
          <FilterList list={sorting} title="Sort by" />
        </div>
      </div>
    </>
  );
}
