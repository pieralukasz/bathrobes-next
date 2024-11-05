"use server";

import { revalidateTag } from "next/cache";
import { db } from "~/server/db";
import { categories } from "~/server/db/schema";

export async function createCategory(name: string) {
  await db.insert(categories).values({
    name,
  });

  revalidateTag("categories");
}
