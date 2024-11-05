import { slugCreator } from "~/lib/utils";
import { db } from ".";
import { categories, products, productColors, productSizes } from "./schema";
import { getXMLProducts } from "./utils";

async function seed() {
  console.log("Starting the seed process...");

  await db.delete(productSizes);
  console.log("Deleted productSizes...");
  await db.delete(productColors);
  console.log("Deleted productColors...");
  await db.delete(products);
  console.log("Deleted products...");
  await db.delete(categories);
  console.log("Deleted categories...");

  const productsFromXML = await getXMLProducts();
  console.log(`Parsed ${productsFromXML.length} products from XML.`);

  // It will work only once during seed process
  const categoryMap = new Map();
  const productMap = new Map();
  const colorMap = new Map();

  for (const item of productsFromXML) {
    const { ean, name, categoryName, color, size, quantity } = item;
    console.log(`Processing product: ${name}`);

    let categoryId;
    if (!categoryMap.has(categoryName)) {
      const [category] = await db
        .insert(categories)
        .values({ name: categoryName, slug: slugCreator(categoryName) })
        .onConflictDoNothing()
        .returning({ id: categories.id });
      categoryId = category?.id;
      categoryMap.set(categoryName, categoryId);
      console.log(`Inserted/Found category ID: ${categoryId}`);
    } else {
      categoryId = categoryMap.get(categoryName);
    }

    let productId;
    if (!productMap.has(name)) {
      const [product] = await db
        .insert(products)
        .values({ name, categoryId, slug: slugCreator(name) })
        .onConflictDoNothing()
        .returning({ id: products.id });
      productId = product?.id;
      productMap.set(name, productId);
      console.log(`Inserted/Found product ID: ${productId}`);
    } else {
      productId = productMap.get(name);
    }

    const colorKey = `${productId}-${color}`;
    let colorId;
    if (!colorMap.has(colorKey)) {
      const [productColor] = await db
        .insert(productColors)
        .values({ productId, color })
        .onConflictDoNothing()
        .returning({ id: productColors.id });
      colorId = productColor?.id;
      colorMap.set(colorKey, colorId);
      console.log(`Inserted/Found color ID: ${colorId}`);
    } else {
      colorId = colorMap.get(colorKey);
    }

    await db
      .insert(productSizes)
      .values({
        colorId,
        size,
        ean,
        quantity,
      })
      .onConflictDoNothing();

    console.log(
      `Inserted size for color ID ${colorId}, EAN ${ean}, quantity ${quantity}`,
    );
  }

  console.log(`Database seeded with ${productsFromXML.length} products 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(1);
  });
