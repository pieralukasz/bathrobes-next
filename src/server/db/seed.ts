import { slugCreator } from "~/lib/utils";
import { db } from ".";
import { getXMLProducts } from "./utils";
import { categories } from "./schema/categories";
import { productColors, productSizes, products } from "./schema/products";
import { inArray, not } from "drizzle-orm";

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
        set: { name: categoryName, updatedAt: new Date() },
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
      .returning({ id: products.id });

    const productId = product?.id;

    if (!productId) {
      throw new Error(`Product not found: ${name}`);
    } else {
      console.log(`Inserted/Found product ID: ${productId}`);
    }

    const [productColor] = await db
      .insert(productColors)
      .values({ productId, color })
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
}

// Export for testing
export default seed;

// Execute if running as main script
if (require.main === module) {
  seed()
    .catch((e) => {
      console.error("Error seeding database:", e);
      process.exit(1);
    })
    .then(() => {
      console.log("Database seeding completed successfully!");
      process.exit(0);
    });
}
