import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { productQueries } from "./products";
import { db } from "..";

vi.mock("..", () => ({
  db: {
    query: {
      products: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
      categories: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
  },
}));

describe("Product Queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCategory", () => {
    it("should find category by slug", async () => {
      const mockCategory = {
        id: 1,
        name: "Test Category",
        slug: "test-category",
      };
      (db.query.categories.findFirst as any).mockResolvedValue(mockCategory);

      const result = await productQueries.getCategory("test-category");
      expect(result).toEqual(mockCategory);
    });

    it("should return null for non-existent category", async () => {
      (db.query.categories.findFirst as any).mockResolvedValue(null);
      const result = await productQueries.getCategory("non-existent");
      expect(result).toBeNull();
    });
  });

  describe("getCategories", () => {
    it("should return all categories with products", async () => {
      const mockCategories = Array.from({ length: 3 }, () => ({
        id: faker.number.int(),
        name: faker.commerce.department(),
        slug: faker.helpers.slugify(faker.commerce.department()),
        products: [
          { id: faker.number.int(), name: faker.commerce.productName() },
        ],
      }));
      (db.query.categories.findMany as any).mockResolvedValue(mockCategories);

      const result = await productQueries.getCategories();
      expect(result).toEqual(mockCategories);
    });

    it("should handle empty categories list", async () => {
      (db.query.categories.findMany as any).mockResolvedValue([]);
      const result = await productQueries.getCategories();
      expect(result).toEqual([]);
    });
  });

  describe("getProducts", () => {
    it("should filter by category when categoryId provided", async () => {
      const mockProducts = Array.from({ length: 3 }, () => ({
        id: faker.number.int(),
        name: faker.commerce.productName(),
      }));
      (db.query.products.findMany as any).mockResolvedValue(mockProducts);

      const result = await productQueries.getProducts({ categoryId: 1 });
      expect(result).toEqual(mockProducts);
    });

    it("should search products by name/description", async () => {
      await productQueries.getProducts({ searchValue: "test" });
      expect(db.query.products.findMany).toHaveBeenCalled();
    });

    it("should sort products by createdAt in ascending order by default", async () => {
      await productQueries.getProducts({});
      expect(db.query.products.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: expect.any(Function),
        }),
      );
    });

    it("should sort products in reverse order when specified", async () => {
      await productQueries.getProducts({ reverse: true });
      expect(db.query.products.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: expect.any(Function),
        }),
      );
    });

    it("should include related data in product query", async () => {
      const mockProduct = {
        id: faker.number.int(),
        name: faker.commerce.productName(),
        category: { id: 1, name: "Test" },
        colors: [
          {
            id: 1,
            color: "Red",
            sizes: [{ id: 1, size: "M", quantity: 5 }],
          },
        ],
      };
      (db.query.products.findMany as any).mockResolvedValue([mockProduct]);

      const result = await productQueries.getProducts({});
      expect(result[0]).toHaveProperty("category");
      expect(result[0]).toHaveProperty("colors");
      expect(result[0]?.colors[0]).toHaveProperty("sizes");
    });
  });

  describe("getProduct", () => {
    it("should return product by ID with all relations", async () => {
      const mockProduct = {
        id: 1,
        name: faker.commerce.productName(),
        category: { id: 1, name: "Test" },
        colors: [
          {
            id: 1,
            color: "Blue",
            sizes: [{ id: 1, size: "L", quantity: 10 }],
          },
        ],
      };
      (db.query.products.findFirst as any).mockResolvedValue(mockProduct);

      const result = await productQueries.getProduct(1);
      expect(result).toEqual(mockProduct);
    });

    it("should return null for non-existent product", async () => {
      (db.query.products.findFirst as any).mockResolvedValue(null);
      const result = await productQueries.getProduct(999);
      expect(result).toBeNull();
    });
  });

  describe("getProductBySlug", () => {
    it("should find product using slug", async () => {
      const mockProduct = {
        id: 1,
        slug: "test-product",
        name: faker.commerce.productName(),
      };
      (db.query.products.findFirst as any).mockResolvedValue(mockProduct);

      const result = await productQueries.getProductBySlug("test-product");
      expect(result).toEqual(mockProduct);
    });
  });

  describe("getProductRecommendations", () => {
    it("should return limited number of products from same category", async () => {
      const mockProducts = Array.from({ length: 4 }, () => ({
        id: faker.number.int(),
        name: faker.commerce.productName(),
        colors: [
          {
            id: 1,
            sizes: [{ id: 1, size: "M" }],
          },
        ],
      }));
      (db.query.products.findMany as any).mockResolvedValue(mockProducts);

      const result = await productQueries.getProductRecommendations(1);
      expect(result).toHaveLength(4);
      expect(result[0]).toHaveProperty("colors");
    });

    it("should handle empty recommendations", async () => {
      (db.query.products.findMany as any).mockResolvedValue([]);
      const result = await productQueries.getProductRecommendations(1);
      expect(result).toEqual([]);
    });
  });
});
