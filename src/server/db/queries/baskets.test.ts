import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { basketQueries } from "./baskets";
import { db } from "..";

vi.mock("..", () => ({
  db: {
    query: {
      baskets: {
        findFirst: vi.fn(),
      },
    },
  },
}));

describe("Basket Queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getByUserId", () => {
    it("should throw error if userId not provided", async () => {
      await expect(basketQueries.getByUserId("")).rejects.toThrow(
        "User ID is required",
      );
    });

    it("should return basket with items", async () => {
      const mockBasket = {
        id: faker.number.int(),
        items: [],
      };
      (db.query.baskets.findFirst as any).mockResolvedValue(mockBasket);

      const result = await basketQueries.getByUserId("user123");
      expect(result).toEqual(mockBasket);
    });

    it("should return null for non-existent basket", async () => {
      (db.query.baskets.findFirst as any).mockResolvedValue(null);
      const result = await basketQueries.getByUserId("nonexistentuser");
      expect(result).toBeNull();
    });

    it("should include complete product details in basket items", async () => {
      const mockBasket = {
        id: faker.number.int(),
        items: [
          {
            quantity: 1,
            productSize: {
              size: "L",
              color: {
                color: "Blue",
                product: {
                  name: faker.commerce.productName(),
                  price: faker.number.int({ min: 10, max: 200 }),
                },
              },
            },
          },
        ],
      };
      (db.query.baskets.findFirst as any).mockResolvedValue(mockBasket);

      const result = await basketQueries.getByUserId("user123");
      expect(result?.items[0]?.productSize.color.product).toBeDefined();
      expect(result?.items[0]?.quantity).toBeDefined();
    });

    it("should handle basket with no items", async () => {
      const mockEmptyBasket = {
        id: faker.number.int(),
        items: [],
      };
      (db.query.baskets.findFirst as any).mockResolvedValue(mockEmptyBasket);

      const result = await basketQueries.getByUserId("user123");
      expect(result?.items).toHaveLength(0);
    });

    it("should verify query includes all necessary relations", async () => {
      await basketQueries.getByUserId("user123");
      expect(db.query.baskets.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          with: expect.objectContaining({
            items: expect.objectContaining({
              with: expect.objectContaining({
                productSize: expect.any(Object),
              }),
            }),
          }),
        }),
      );
    });
  });
});
