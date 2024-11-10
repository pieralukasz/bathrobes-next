import { db } from "..";
import { eq } from "drizzle-orm";

// Fetch all categories
export async function getAllCategories() {
  return await db.query.categories.findMany({
    orderBy: (categories, { desc }) => [desc(categories.createdAt)],
    with: {
      products: true,
    },
  });
}

// Fetch a single category by ID
export async function getCategoryById(id: number) {
  return await db.query.categories.findFirst({
    where: (categories) => eq(categories.id, id),
    with: {
      products: true,
    },
  });
}

// Fetch products with optional query, sort, and reverse
export async function getProducts({
  query,
  reverse = false,
  sortKey = "createdAt",
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<any[]> {
  const orderDirection = reverse ? "asc" : "desc";

  return await db.query.products.findMany({
    where: query
      ? (products) => products.name.ilike(`%${query}%`)
      : undefined,
    orderBy: (products, { [orderDirection]: order }) => [order(products[sortKey])],
    with: {
      colors: true,
    },
  });
}

// Fetch a single product by ID
export async function getProductById(id: number) {
  return await db.query.products.findFirst({
    where: (products) => eq(products.id, id),
    with: {
      colors: true,
    },
  });
}
