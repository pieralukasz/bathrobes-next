import {
  products,
  productColors,
  productSizes,
  categories,
} from "~/server/db/schema";

import { db } from "../server/db";
import { sql } from "drizzle-orm";

export const deleteAllDataFromDatabase = async () => {
  await db.delete(productSizes);
  await db.delete(productColors);
  await db.delete(products);
  await db.delete(categories);

  // Reset sequences
  await db.execute(sql`
      ALTER SEQUENCE categories_id_seq RESTART WITH 1;
      ALTER SEQUENCE products_id_seq RESTART WITH 1;
      ALTER SEQUENCE product_colors_id_seq RESTART WITH 1;
      ALTER SEQUENCE product_sizes_id_seq RESTART WITH 1;
    `);
};
