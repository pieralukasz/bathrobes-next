import { db } from ".";
import { categories, products, productColors, productSizes } from "./schema";

// Create a new category
export async function createCategory(name: string, slug: string) {
  return await db.insert(categories).values({ name, slug }).returning();
}

// Update an existing category
export async function updateCategory(id: number, name: string, slug: string) {
  return await db.update(categories).set({ name, slug }).where(categories.id.eq(id)).returning();
}

// Delete a category
export async function deleteCategory(id: number) {
  return await db.delete(categories).where(categories.id.eq(id));
}

// Create a new product
export async function createProduct(name: string, categoryId: number, slug: string) {
  return await db.insert(products).values({ name, categoryId, slug }).returning();
}

// Update an existing product
export async function updateProduct(id: number, name: string, categoryId: number, slug: string) {
  return await db.update(products).set({ name, categoryId, slug }).where(products.id.eq(id)).returning();
}

// Delete a product
export async function deleteProduct(id: number) {
  return await db.delete(products).where(products.id.eq(id));
}

// Create a new product color
export async function createProductColor(productId: number, color: string, imageUrl?: string) {
  return await db.insert(productColors).values({ productId, color, imageUrl }).returning();
}

// Update an existing product color
export async function updateProductColor(id: number, color: string, imageUrl?: string) {
  return await db.update(productColors).set({ color, imageUrl }).where(productColors.id.eq(id)).returning();
}

// Delete a product color
export async function deleteProductColor(id: number) {
  return await db.delete(productColors).where(productColors.id.eq(id));
}

// Create a new product size
export async function createProductSize(colorId: number, size: string, ean: string, quantity: number) {
  return await db.insert(productSizes).values({ colorId, size, ean, quantity }).returning();
}

// Update an existing product size
export async function updateProductSize(id: number, size: string, ean: string, quantity: number) {
  return await db.update(productSizes).set({ size, ean, quantity }).where(productSizes.id.eq(id)).returning();
}

// Delete a product size
export async function deleteProductSize(id: number) {
  return await db.delete(productSizes).where(productSizes.id.eq(id));
}
