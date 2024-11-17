import { beforeEach, describe, expect, it, vi } from "vitest";
import { db } from ".";
import seed from "./seed";
import { getXMLProducts, ParsedProduct } from "./utils";
import { products, productColors, productSizes, categories } from "./schema";
import { afterEach } from "node:test";

vi.mock("./utils", () => ({
  getXMLProducts: vi.fn(),
}));

const clearDatabase = async () => {
  await db.delete(productSizes);
  await db.delete(productColors);
  await db.delete(products);
  await db.delete(categories);
};

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

describe("Database seeding", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.mocked(getXMLProducts).mockResolvedValue(mockProducts);
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it("should create categories, products, colors and sizes", async () => {
    await seed();

    // Verify category
    const categoryResult = await db.select().from(categories);
    expect(categoryResult).toHaveLength(1);
    expect(categoryResult[0]?.name).toBe("Luxury Bathrobes");
    expect(categoryResult[0]?.slug).toBe("luxury-bathrobes");

    // Verify product
    const productResult = await db.select().from(products);
    expect(productResult).toHaveLength(1);
    expect(productResult[0]?.name).toBe("Test Bathrobe");
    expect(productResult[0]?.slug).toBe("test-bathrobe");

    // Verify colors
    const colorResult = await db.select().from(productColors);
    expect(colorResult).toHaveLength(1);
    expect(colorResult[0]?.color).toBe("Blue");

    // Verify sizes
    const sizeResult = await db.select().from(productSizes);
    expect(sizeResult).toHaveLength(2);
    expect(sizeResult.map((s) => s.size).sort()).toEqual(["L", "M"]);
    expect(sizeResult.every((s) => s.quantity === 1)).toBe(true);
  });

  it("should update existing products instead of creating duplicates", async () => {
    // First seed
    await seed();

    // Verify initial state
    const initialCounts = await getTableCounts();

    // Second seed
    await seed();

    // Verify counts haven't changed
    const finalCounts = await getTableCounts();
    expect(finalCounts).toEqual(initialCounts);
  });

  // Helper function to get table counts
  async function getTableCounts() {
    const [categoryCount, productCount, colorCount] = await Promise.all([
      db.select().from(categories),
      db.select().from(products),
      db.select().from(productColors),
    ]);

    return {
      categories: categoryCount.length,
      products: productCount.length,
      colors: colorCount.length,
    };
  }

  it("should set quantity to 0 for products not in XML", async () => {
    // First seed with mock data
    await seed();

    if (!mockProducts[0] || !mockProducts[1]) {
      throw new Error("Mock data not found");
    }

    // Change mock data to simulate removed product
    vi.mocked(getXMLProducts).mockResolvedValue([mockProducts[0]]);

    // Seed again
    await seed();

    const sizes = await db.select().from(productSizes);
    const removedSize = sizes.find((s) => s.ean === mockProducts[1]?.ean);

    expect(removedSize?.quantity).toBe(0);
  });
});
