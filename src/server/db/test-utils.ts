import { db } from ".";
import { products, productColors, productSizes, categories } from "./schema";

export async function clearDatabase() {
  // Delete in correct order to respect foreign key constraints
  await db.delete(productSizes);
  await db.delete(productColors);
  await db.delete(products);
  await db.delete(categories);
}

export async function setupTestDatabase() {
  await clearDatabase();
}

export async function teardownTestDatabase() {
  await clearDatabase();
}
