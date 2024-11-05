import { CategoryProductsList } from "./components/category-products-list";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { categories } from "~/server/db/schema";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const categoryId = (await params).categoryId;

  if (Number.isNaN(Number(categoryId))) {
    notFound();
  }

  const category = await db.query.categories.findFirst({
    where: eq(categories.id, Number(categoryId)),
  });

  if (!category) {
    notFound();
  }

  return <CategoryProductsList categoryId={categoryId} />;
}
