import { db } from "..";
import { eq, like, or, and, exists, gt } from "drizzle-orm";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { delay } from "../../../lib/utils";
import { productColors, productSizes } from "../schema";

export type SortKey = "createdAt" | "updatedAt" | "isNewArrival";

export const productQueries = {
  getCategory: async (slug: string) => {
    "use cache";
    cacheTag("categories");
    return await db.query.categories.findFirst({
      where: (categories) =>
        and(eq(categories.slug, slug), eq(categories.visible, true)),
      with: {
        products: true,
      },
    });
  },

  getCategories: async () => {
    "use cache";
    cacheTag("categories");

    return await db.query.categories.findMany({
      where: (categories) => eq(categories.visible, true),
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
    "use cache";
    cacheTag("products");

    return await db.query.products.findMany({
      where: (products) => {
        const conditions = [];

        if (categoryId) {
          conditions.push(eq(products.categoryId, categoryId));
        }

        if (searchValue) {
          conditions.push(
            or(
              like(products.name, `%${searchValue}%`),
              like(products.description || "", `%{searchValue}%`),
              like(products.slug, `%${searchValue}%`),
            ),
          );
        }

        conditions.push(
          exists(
            db
              .select()
              .from(productSizes)
              .where(
                and(
                  gt(productSizes.quantity, 0),
                  exists(
                    db
                      .select()
                      .from(productColors)
                      .where(
                        and(
                          eq(productColors.productId, products.id),
                          eq(productSizes.colorId, productColors.id),
                        ),
                      ),
                  ),
                ),
              ),
          ),
        );

        return conditions.length > 1 ? and(...conditions) : conditions[0];
      },
      orderBy: (products, { desc, asc }) => [
        reverse ? desc(products[sortKey]) : asc(products[sortKey]),
        asc(products.name),
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
    "use cache";
    cacheTag(`product-${id}`);

    const product = await db.query.products.findFirst({
      where: (products) =>
        and(
          eq(products.id, id),
          exists(
            db
              .select()
              .from(productSizes)
              .where(
                and(
                  gt(productSizes.quantity, 0),
                  exists(
                    db
                      .select()
                      .from(productColors)
                      .where(
                        and(
                          eq(productColors.productId, products.id),
                          eq(productSizes.colorId, productColors.id),
                        ),
                      ),
                  ),
                ),
              ),
          ),
        ),
      with: {
        category: true,
        colors: {
          with: {
            sizes: true,
          },
        },
      },
    });

    return product;
  },

  getColors: async (productId?: number) => {
    if (!productId) {
      return [];
    }

    return await db.query.productColors.findMany({
      where: (productColors) => eq(productColors.productId, productId),
      with: {
        sizes: true,
      },
    });
  },

  getProductBySlug: async (slug: string) => {
    "use cache";
    cacheTag(`product-${slug}`);

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
