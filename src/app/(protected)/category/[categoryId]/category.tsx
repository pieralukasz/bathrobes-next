"use cache";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { categories } from "~/server/db/schema";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Category = async ({ categoryId }: { categoryId: string }) => {
  await sleep(1000);

  const category = await db.query.categories.findFirst({
    where: eq(categories.id, parseInt(categoryId)),
  });

  return <div>My category: {category?.name}</div>;
};
