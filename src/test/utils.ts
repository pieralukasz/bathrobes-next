import {
  products,
  productColors,
  productSizes,
  categories,
} from "~/server/db/schema";
import { db } from "../server/db";
import { sql } from "drizzle-orm";

export const deleteAllDataFromDatabase = async () => {
  try {
    await db.transaction(async (tx) => {
      // Disable foreign key checks temporarily
      await tx.execute(sql`SET CONSTRAINTS ALL DEFERRED`);

      // Delete data in reverse order of dependencies
      await Promise.all([tx.delete(productSizes), tx.delete(productColors)]);
      await tx.delete(products);
      await tx.delete(categories);

      // Reset sequences
      await tx.execute(sql`
        ALTER SEQUENCE product_sizes_id_seq RESTART WITH 1;
        ALTER SEQUENCE product_colors_id_seq RESTART WITH 1;
        ALTER SEQUENCE products_id_seq RESTART WITH 1;
        ALTER SEQUENCE categories_id_seq RESTART WITH 1;
      `);

      // Re-enable foreign key checks
      await tx.execute(sql`SET CONSTRAINTS ALL IMMEDIATE`);
    });
  } catch (error) {
    console.error("Failed to clear database:", error);
    throw error;
  }
};
