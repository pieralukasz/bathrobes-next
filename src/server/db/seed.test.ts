import { beforeEach, describe, expect, it, vi } from "vitest";
import { db } from ".";
import seed from "./seed";
import { getXMLProducts, ParsedProduct } from "./utils";
import { products, productColors, productSizes, categories } from "./schema";
import { eq } from "drizzle-orm";

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
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getXMLProducts).mockResolvedValue(mockProducts);
  });

  it("should create categories, products, colors and sizes", async () => {
    await seed();

    const categoryResult = await db
      .select()
      .from(categories)
      .where(eq(categories.name, "Luxury Bathrobes"))
      .limit(1);
    expect(categoryResult[0]?.name).toBe("Luxury Bathrobes");
    expect(categoryResult[0]?.slug).toBe("luxury-bathrobes");

    const productResult = await db
      .select()
      .from(products)
      .where(eq(products.name, "Test Bathrobe"))
      .limit(1);
    expect(productResult[0]?.name).toBe("Test Bathrobe");
    expect(productResult[0]?.slug).toBe("test-bathrobe");

    const colorResult = await db
      .select()
      .from(productColors)
      .where(eq(productColors.color, "Blue"))
      .limit(1);
    expect(colorResult[0]?.color).toBe("Blue");

    const firstEan = mockProducts[0]?.ean;
    if (!firstEan) throw new Error("Mock product EAN not found");

    const sizeResult = await db
      .select()
      .from(productSizes)
      .where(eq(productSizes.ean, firstEan));
    expect(sizeResult[0]?.size).toBe("L");
    expect(sizeResult[0]?.quantity).toBe(1);
  });

  it("should set quantity to 0 for products not in XML", async () => {
    await seed();

    if (!mockProducts[0]?.ean) throw new Error("Mock product EAN not found");

    const secondEan = mockProducts[1]?.ean;
    if (!secondEan) throw new Error("Mock product EAN not found");

    vi.mocked(getXMLProducts).mockResolvedValue([mockProducts[0]]);
    await seed();

    const sizes = await db
      .select()
      .from(productSizes)
      .where(eq(productSizes.ean, secondEan));
    expect(sizes[0]?.quantity).toBe(0);
  });
});
