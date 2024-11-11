import { db } from "..";
import { eq } from "drizzle-orm";
import { InferProduct } from "../schema";

type SortKey = "createdAt" | "updatedAt" | "isNewArrival";

export async function getCategory(slug: string) {
  return await db.query.categories.findFirst({
    where: (categories) => eq(categories.slug, slug),
  });
}

export async function getCategories() {
  return await db.query.categories.findMany({
    orderBy: (categories, { asc }) => asc(categories.name),
    with: {
      products: true,
    },
  });
}

export async function getProducts({
  categoryId,
  sortKey = "createdAt",
  reverse = false,
}: {
  categoryId?: number;
  sortKey?: SortKey;
  reverse?: boolean;
}) {
  return await db.query.products.findMany({
    where: categoryId
      ? (products) => eq(products.categoryId, categoryId)
      : undefined,
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
}

export async function getProduct(
  id: number,
): Promise<InferProduct | undefined> {
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
}

export type ProductWithDetails = Awaited<ReturnType<typeof getProductBySlug>>;
export async function getProductBySlug(slug: string) {
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
}

export async function getProductRecommendations(categoryId: number) {
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
}
