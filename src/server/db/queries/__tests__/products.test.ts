import { beforeEach, describe, expect, it } from "vitest";
import { db } from "../../index";
import { productQueries } from "../products";
import { categories } from "../../schema/categories";
import { productColors, products, productSizes } from "../../schema/products";
import { slugCreator } from "~/lib/utils";
import { eq } from "drizzle-orm";

async function createTestCategory(name: string) {
  const [category] = await db
    .insert(categories)
    .values({
      name,
      slug: slugCreator(name),
    })
    .returning();

  if (!category) {
    throw new Error("Category not created");
  }

  // Verify category exists
  const verifyCategory = await db.query.categories.findFirst({
    where: (categories) => eq(categories.id, category.id),
  });

  if (!verifyCategory) {
    throw new Error("Category not found after creation");
  }

  return category;
}

async function createTestProduct(name: string, categoryId: number) {
  // Verify category exists before creating product
  const category = await db.query.categories.findFirst({
    where: (categories) => eq(categories.id, categoryId),
  });

  if (!category) {
    throw new Error(`Category with ID ${categoryId} not found`);
  }

  const [product] = await db
    .insert(products)
    .values({
      name,
      slug: slugCreator(name),
      categoryId,
    })
    .returning();

  if (!product) {
    throw new Error("Product not created");
  }

  return product;
}

async function createTestProductColor(productId: number, color: string) {
  const [productColor] = await db
    .insert(productColors)
    .values({
      productId,
      color,
    })
    .returning();

  if (!productColor) {
    throw new Error("Product color not created");
  }

  return productColor;
}

async function createTestProductSize(
  colorId: number,
  size: string,
  ean: string,
) {
  const [productSize] = await db
    .insert(productSizes)
    .values({
      colorId,
      size,
      ean,
      quantity: 1,
    })
    .returning();

  if (!productSize) {
    throw new Error("Product size not created");
  }

  return productSize;
}

describe("productQueries", () => {
  describe("getCategory", () => {
    it("should return category with products", async () => {
      // Create category first and wait for completion
      const category = await createTestCategory("Test Category");

      expect(category).toBeDefined();

      // Then create product
      const product = await createTestProduct("Test Product", category.id);
      expect(product).toBeDefined();

      // Finally query
      const result = await productQueries.getCategory(category.slug);
      expect(result).toBeDefined();
      expect(result?.name).toBe("Test Category");
      expect(result?.products).toHaveLength(1);
      expect(result?.products[0]?.id).toBe(product.id);
    });
  });

  describe("getProducts", () => {
    it("should return products filtered by category", async () => {
      // Create categories first
      const category1 = await createTestCategory("Category 1");
      const category2 = await createTestCategory("Category 2");
      expect(category1).toBeDefined();
      expect(category2).toBeDefined();

      // Then create products
      const product1 = await createTestProduct("Product 1", category1.id);
      await createTestProduct("Product 2", category2.id);
      expect(product1).toBeDefined();

      // Then create color and size
      const color1 = await createTestProductColor(product1.id, "Red");
      expect(color1).toBeDefined();
      await createTestProductSize(color1.id, "M", "1234567890123");

      // Finally query
      const results = await productQueries.getProducts({
        categoryId: category1.id,
      });

      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe(product1.id);
      expect(results[0]?.colors).toHaveLength(1);
      expect(results[0]?.colors[0]?.sizes).toHaveLength(1);
    });

    it("should return products matching search value", async () => {
      const category = await createTestCategory("Test Category");
      const product1 = await createTestProduct("Unique Product", category.id);
      await createTestProduct("Different Item", category.id);

      const results = await productQueries.getProducts({
        searchValue: "unique",
      });

      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe(product1.id);
    });

    it("should sort products by specified key", async () => {
      const category = await createTestCategory("Test Category");
      await createTestProduct("Product A", category.id);
      await createTestProduct("Product B", category.id);

      const results = await productQueries.getProducts({
        sortKey: "createdAt",
        reverse: true,
      });

      expect(results).toHaveLength(2);

      if (!results[0] || !results[1]) {
        throw new Error("Results not found");
      }

      expect(new Date(results[0].createdAt).getTime()).toBeGreaterThan(
        new Date(results[1].createdAt).getTime(),
      );
    });
  });

  describe("getProduct", () => {
    it("should return product by id with relations", async () => {
      const category = await createTestCategory("Test Category");
      const product = await createTestProduct("Test Product", category.id);
      const color = await createTestProductColor(product.id, "Blue");
      await createTestProductSize(color.id, "L", "1234567890123");

      const result = await productQueries.getProduct(product.id);

      expect(result).toBeDefined();
      expect(result?.name).toBe("Test Product");
      expect(result?.category.name).toBe("Test Category");
      expect(result?.colors).toHaveLength(1);
      expect(result?.colors[0]?.sizes).toHaveLength(1);
    });
  });

  describe("getProductRecommendations", () => {
    it("should return up to 4 products from the same category", async () => {
      const category = await createTestCategory("Test Category");
      for (let i = 1; i <= 5; i++) {
        await createTestProduct(`Product ${i}`, category.id);
      }

      const results = await productQueries.getProductRecommendations(
        category.id,
      );

      expect(results).toHaveLength(4);
      results.forEach((product) => {
        expect(product.categoryId).toBe(category.id);
      });
    });
  });
});
