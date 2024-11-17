import { beforeEach, describe, expect, it, vi } from "vitest";
import { db } from ".";
import seed from "./seed";
import { getXMLProducts, ParsedProduct } from "./utils";
import { products, productColors, productSizes, categories } from "./schema";
import { afterEach } from "node:test";

import { deleteAllDataFromDatabase } from "~/test/utils";

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

vi.mock("./utils", () => ({
  getXMLProducts: vi.fn(),
}));

const mockProducts: ParsedProduct[] = [
  {
    ean: "1234567890123",
    name: "Test Bathrobe",
    categoryName: "Luxury Bathrobes",
    color: "Blue",
    size: "L",
    quantity: 1,
  },
  {
    ean: "1234567890124",
    name: "Test Bathrobe",
    categoryName: "Luxury Bathrobes",
    color: "Blue",
    size: "M",
    quantity: 1,
  },
];

describe("Database seeding with mock data", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.mocked(getXMLProducts).mockResolvedValue(mockProducts);
    await deleteAllDataFromDatabase();
  });

  afterEach(async () => {
    await deleteAllDataFromDatabase();
  });

  it("should create categories, products, colors and sizes", async () => {
    await seed();

    const categoryResult = await db.select().from(categories);
    expect(categoryResult).toHaveLength(1);
    expect(categoryResult[0]?.name).toBe("Luxury Bathrobes");
    expect(categoryResult[0]?.slug).toBe("luxury-bathrobes");

    const productResult = await db.select().from(products);
    expect(productResult).toHaveLength(1);
    expect(productResult[0]?.name).toBe("Test Bathrobe");
    expect(productResult[0]?.slug).toBe("test-bathrobe");

    const colorResult = await db.select().from(productColors);
    expect(colorResult).toHaveLength(1);
    expect(colorResult[0]?.color).toBe("Blue");

    const sizeResult = await db.select().from(productSizes);
    expect(sizeResult).toHaveLength(2);
    expect(sizeResult.map((s) => s.size).sort()).toEqual(["L", "M"]);
    expect(sizeResult.every((s) => s.quantity === 1)).toBe(true);
  });

  it("should update existing products instead of creating duplicates", async () => {
    await seed();

    const initialCounts = await getTableCounts();

    await seed();

    const finalCounts = await getTableCounts();
    expect(finalCounts).toEqual(initialCounts);
  });

  it("should set quantity to 0 for products not in XML", async () => {
    await seed();

    if (!mockProducts[0] || !mockProducts[1]) {
      throw new Error("Mock data not found");
    }

    vi.mocked(getXMLProducts).mockResolvedValue([mockProducts[0]]);

    await seed();

    const sizes = await db.select().from(productSizes);
    const removedSize = sizes.find((s) => s.ean === mockProducts[1]?.ean);

    expect(removedSize?.quantity).toBe(0);
  });
});
