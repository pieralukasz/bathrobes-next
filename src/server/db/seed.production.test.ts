import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { db } from ".";
import seed from "./seed";
import { products, productColors, productSizes, categories } from "./schema";
import { deleteAllDataFromDatabase } from "~/test/utils";

vi.mock("~/env", () => ({
  env: {
    XML_URL: "https://magazyn.szlafroki.com/csv/ArkuszZamowien.xml",
  },
}));

async function getTableCounts() {
  const [categoryCount, productCount, colorCount, sizeCount] =
    await Promise.all([
      db.select().from(categories),
      db.select().from(products),
      db.select().from(productColors),
      db.select().from(productSizes),
    ]);

  return {
    categories: categoryCount.length,
    products: productCount.length,
    colors: colorCount.length,
    sizes: sizeCount.length,
  };
}

describe("Production XML Database Seeding", () => {
  beforeEach(async () => {
    await deleteAllDataFromDatabase();
  });

  afterEach(async () => {
    await deleteAllDataFromDatabase();
  });

  it("should process the real XML file", async () => {
    const initialData = await getTableCounts();
    expect(initialData.products).toBe(0);

    await seed();

    const finalData = await getTableCounts();
    const sizes = await db.select().from(productSizes);
    const activeProducts = sizes.filter((s) => s.quantity > 0);

    console.log("\nProduction XML Import Results");
    console.log("===========================");
    console.log(`Categories found:  ${finalData.categories}`);
    console.log(`Products created:  ${finalData.products}`);
    console.log(`Colors available:  ${finalData.colors}`);
    console.log(`Size variations:   ${finalData.sizes}`);
    console.log(`Active products:   ${activeProducts.length}`);
    console.log("===========================\n");

    expect(finalData.categories).toBeGreaterThan(0);
    expect(finalData.products).toBeGreaterThan(0);
    expect(finalData.colors).toBeGreaterThan(0);
    expect(finalData.sizes).toBeGreaterThan(0);
    expect(activeProducts.length).toBeGreaterThan(0);
  }, 60000); // 1 minute timeout for large XML
});
