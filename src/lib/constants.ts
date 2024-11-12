import { SortKey } from "~/server/db/queries/product";

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: SortKey;
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: "Relevance",
  slug: null,
  sortKey: "updatedAt", // change to "createdAt" to sort by creation date
  reverse: false,
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Latest arrivals",
    slug: "latest-desc",
    sortKey: "createdAt",
    reverse: true,
  },
];

export const CACHE_TAGS = {
  products: "products",
  categories: "categories",
  cart: "cart",
  orders: "orders",
} as const;
