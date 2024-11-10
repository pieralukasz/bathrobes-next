import { db } from ".";
import { eq } from "drizzle-orm";
import { categories, products, productColors, productSizes } from "./schema";

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

// Fetch all product colors
export async function getAllProductColors() {
  return await db.query.productColors.findMany({
    orderBy: (productColors, { desc }) => [desc(productColors.createdAt)],
    with: {
      sizes: true,
    },
  });
}

// Fetch a single product color by ID
export async function getProductColorById(id: number) {
  return await db.query.productColors.findFirst({
    where: (productColors) => eq(productColors.id, id),
    with: {
      sizes: true,
    },
  });
}

// Fetch all product sizes
export async function getAllProductSizes() {
  return await db.query.productSizes.findMany({
    orderBy: (productSizes, { desc }) => [desc(productSizes.createdAt)],
  });
}

// Fetch a single product size by ID
export async function getProductSizeById(id: number) {
  return await db.query.productSizes.findFirst({
    where: (productSizes) => eq(productSizes.id, id),
  });
}
