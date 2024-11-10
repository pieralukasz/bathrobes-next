import { db } from ".";
import { categories, products, productColors, productSizes } from "./schema";

// Fetch all categories
export async function getAllCategories() {
  return await db.select().from(categories);
}

// Fetch a single category by ID
export async function getCategoryById(id: number) {
  return await db.select().from(categories).where(categories.id.eq(id));
}

// Fetch all products
export async function getAllProducts() {
  return await db.select().from(products);
}

// Fetch a single product by ID
export async function getProductById(id: number) {
  return await db.select().from(products).where(products.id.eq(id));
}

// Fetch all product colors
export async function getAllProductColors() {
  return await db.select().from(productColors);
}

// Fetch a single product color by ID
export async function getProductColorById(id: number) {
  return await db.select().from(productColors).where(productColors.id.eq(id));
}

// Fetch all product sizes
export async function getAllProductSizes() {
  return await db.select().from(productSizes);
}

// Fetch a single product size by ID
export async function getProductSizeById(id: number) {
  return await db.select().from(productSizes).where(productSizes.id.eq(id));
}
