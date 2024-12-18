import { slugCreator } from "~/lib/utils";
import { db } from ".";
import { getXMLProducts } from "./utils";
import {
  categories,
  productColors,
  productSizes,
  products,
} from "./schema/products";
import { inArray, not } from "drizzle-orm";

import { defaultUrl } from "~/lib/url";

async function seed() {
  const productsFromXML = await getXMLProducts();
  console.log(`Parsed ${productsFromXML.length} products from XML.`);

  const productSizesProcessed = new Set<string>();

  for (const item of productsFromXML) {
    const { ean, name, categoryName, color, size } = item;

    const [category] = await db
      .insert(categories)
      .values({ name: categoryName, slug: slugCreator(categoryName) })
      .onConflictDoUpdate({
        target: [categories.slug],
        set: { updatedAt: new Date() },
      })
      .returning({ id: categories.id });

    const categoryId = category?.id;

    if (!categoryId) {
      throw new Error(`Category not found: ${categoryName}`);
    } else {
      console.log(`Inserted/Found category ID: ${categoryId}`);
    }

    const [product] = await db
      .insert(products)
      .values({
        name,
        categoryId,
        slug: slugCreator(name),
      })
      .onConflictDoUpdate({
        target: [products.slug],
        set: { categoryId, updatedAt: new Date() },
      })
      .returning({ id: products.id, name: products.name });

    const productId = product?.id;
    const productName = product?.name;

    if (!productId || !productName) {
      throw new Error(`Product not found: ${name}`);
    } else {
      console.log(`Inserted/Found product ${name}: ${productId}`);
    }

    const [productColor] = await db
      .insert(productColors)
      .values({ productId, color, productName })
      .onConflictDoUpdate({
        target: [productColors.productId, productColors.color], // Matches the unique constraint
        set: { updatedAt: new Date() },
      })
      .returning({ id: productColors.id });

    const colorId = productColor?.id;

    if (!colorId) {
      throw new Error(`Color not found: ${color}`);
    } else {
      console.log(`Inserted/Found color ID: ${colorId}`);
    }

    await db
      .insert(productSizes)
      .values({
        colorId,
        size,
        ean,
        quantity: 1,
      })
      .onConflictDoUpdate({
        target: [productSizes.ean],
        set: { colorId, size, quantity: 1, updatedAt: new Date() },
      });

    productSizesProcessed.add(ean);

    console.log(`Inserted size for color ID ${colorId}, EAN ${ean}`);
  }

  await db
    .update(productSizes)
    .set({
      quantity: 0,
      updatedAt: new Date(),
    })
    .where(not(inArray(productSizes.ean, Array.from(productSizesProcessed))));

  console.log(`Database seeded with ${productsFromXML.length} products 🌱`);

  try {
    await fetch(`${defaultUrl}/api/revalidate`, {
      method: "POST",
    });
    console.log("Cache revalidated successfully");
  } catch (error) {
    console.warn("Failed to revalidate cache:", error);
  }
}

export async function seedDatabase() {
  return seed();
}
