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

// Fetch all products
export async function getAllProducts() {
  return await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.createdAt)],
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
