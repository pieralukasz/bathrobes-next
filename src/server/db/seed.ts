import { db } from ".";
import { products } from "./schema";
import { getXMLProducts } from "./utils";

async function seed() {
  await db.delete(products);

  const productsFromXML = await getXMLProducts();

  //   for (const product of productsFromXML) {
  //     await db
  //       .insert(products)
  //       .values({
  //         ean: product.ean,
  //         name: product.name,
  //         color: product.color,
  //         size: product.size,
  //         quantity: product.quantity,
  //         // categoryName: product.categoryName,
  //       })
  //       .onConflictDoUpdate({
  //         target: products.ean,
  //         set: {
  //           ean: product.ean,
  //           name: product.name,
  //           color: product.color,
  //           size: product.size,
  //           quantity: product.quantity,
  //         //   categoryName: product.categoryName,
  //         },
  //       });
  //   }

  console.log(`Upserted ${productsFromXML.length} products`);

  console.log("Database has been seeded 🌱");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
