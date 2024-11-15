import { db } from "..";
import { eq, like, or } from "drizzle-orm";
import { InferProduct } from "../schema";

export type SortKey = "createdAt" | "updatedAt" | "isNewArrival";

export const productQueries = {
  getCategory: async (slug: string) => {
    return await db.query.categories.findFirst({
      where: (categories) => eq(categories.slug, slug),
    });
  },

  getCategories: async () => {
    return await db.query.categories.findMany({
      orderBy: (categories, { asc }) => asc(categories.name),
      with: {
        products: true,
      },
    });
  },

  getProducts: async ({
    categoryId,
    sortKey = "createdAt",
    reverse = false,
    searchValue = "",
  }: {
    categoryId?: number;
    sortKey?: SortKey;
    reverse?: boolean;
    searchValue?: string;
  }) => {
    return await db.query.products.findMany({
      where: (products) => {
        if (categoryId) {
          return eq(products.categoryId, categoryId);
        }
        if (searchValue) {
          return or(
            like(products.name, `%${searchValue}%`),
            like(products.description || "", `%${searchValue}%`),
            like(products.slug, `%${searchValue}%`),
          );
        }
        return undefined;
      },
      orderBy: (products, { desc, asc }) => [
        reverse ? desc(products[sortKey]) : asc(products[sortKey]),
      ],
      with: {
        category: true,
        colors: {
          with: {
            sizes: true,
          },
        },
      },
    });
  },

  getProduct: async (id: number) => {
    return await db.query.products.findFirst({
      where: (products) => eq(products.id, id),
      with: {
        category: true,
        colors: {
          with: {
            sizes: true,
          },
        },
      },
    });
  },

  getProductBySlug: async (slug: string) => {
    return await db.query.products.findFirst({
      where: (products) => eq(products.slug, slug),
      with: {
        category: true,
        colors: {
          with: {
            sizes: true,
          },
        },
      },
    });
  },

  getProductRecommendations: async (categoryId: number) => {
    return await db.query.products.findMany({
      where: (products) => eq(products.categoryId, categoryId),
      with: {
        colors: {
          with: {
            sizes: true,
          },
        },
      },
      limit: 4,
    });
  },
} as const;

export type ProductWithCategoryAndColors = Awaited<
  ReturnType<typeof productQueries.getProductBySlug>
>;
