import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { orderQueries } from "./orders";
import { db } from "..";

vi.mock("..", () => ({
  db: {
    query: {
      orders: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
  },
}));

describe("Order Queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("checkOrderBelongsToUser", () => {
    it("should return true for matching user", async () => {
      const mockOrder = { id: 1, userId: "user123" };
      (db.query.orders.findFirst as any).mockResolvedValue(mockOrder);

      const result = await orderQueries.checkOrderBelongsToUser(1, "user123");
      expect(result).toBe(true);
    });

    it("should return false for non-matching user", async () => {
      (db.query.orders.findFirst as any).mockResolvedValue(null);

      const result = await orderQueries.checkOrderBelongsToUser(
        1,
        "wrong-user",
      );
      expect(result).toBe(false);
    });

    it("should handle invalid order ID", async () => {
      (db.query.orders.findFirst as any).mockResolvedValue(null);
      const result = await orderQueries.checkOrderBelongsToUser(-1, "user123");
      expect(result).toBe(false);
    });
  });

  describe("getOrdersByUserId", () => {
    it("should return user orders with details", async () => {
      const mockOrders = Array.from({ length: 2 }, () => ({
        id: faker.number.int(),
        items: [],
      }));
      (db.query.orders.findMany as any).mockResolvedValue(mockOrders);

      const result = await orderQueries.getOrdersByUserId("user123");
      expect(result).toEqual(mockOrders);
    });

    it("should return empty array for user with no orders", async () => {
      (db.query.orders.findMany as any).mockResolvedValue([]);
      const result = await orderQueries.getOrdersByUserId("newuser");
      expect(result).toEqual([]);
    });

    it("should return orders sorted by creation date", async () => {
      const mockOrders = Array.from({ length: 3 }, () => ({
        id: faker.number.int(),
        createdAt: faker.date.recent(),
        items: [],
      }));
      (db.query.orders.findMany as any).mockResolvedValue(mockOrders);

      const result = await orderQueries.getOrdersByUserId("user123");
      expect(result).toEqual(mockOrders);
      expect(db.query.orders.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: expect.any(Function),
        }),
      );
    });

    it("should include all related order items and product details", async () => {
      const mockOrder = {
        id: faker.number.int(),
        items: [
          {
            id: faker.number.int(),
            productSize: {
              color: {
                product: {
                  name: faker.commerce.productName(),
                },
              },
            },
          },
        ],
      };
      (db.query.orders.findMany as any).mockResolvedValue([mockOrder]);

      const result = await orderQueries.getOrdersByUserId("user123");
      expect(result[0]?.items[0]?.productSize.color.product).toBeDefined();
    });
  });

  describe("getOrderByIdAndUserId", () => {
    it("should return null for non-matching order/user combination", async () => {
      (db.query.orders.findFirst as any).mockResolvedValue(null);
      const result = await orderQueries.getOrderByIdAndUserId(1, "wronguser");
      expect(result).toBeNull();
    });

    it("should return full order details for valid combination", async () => {
      const mockOrder = {
        id: 1,
        userId: "user123",
        items: [
          {
            quantity: 2,
            productSize: {
              color: {
                product: {
                  name: faker.commerce.productName(),
                },
              },
            },
          },
        ],
      };
      (db.query.orders.findFirst as any).mockResolvedValue(mockOrder);

      const result = await orderQueries.getOrderByIdAndUserId(1, "user123");
      expect(result).toEqual(mockOrder);
    });
  });

  describe("getOrderById", () => {
    it("should return order with full details", async () => {
      const mockOrder = {
        id: faker.number.int(),
        items: [
          {
            quantity: 1,
            productSize: {
              size: "M",
              color: {
                color: "Red",
                product: {
                  name: faker.commerce.productName(),
                },
              },
            },
          },
        ],
      };
      (db.query.orders.findFirst as any).mockResolvedValue(mockOrder);

      const result = await orderQueries.getOrderById(1);
      expect(result).toEqual(mockOrder);
    });

    it("should return null for non-existent order", async () => {
      (db.query.orders.findFirst as any).mockResolvedValue(null);
      const result = await orderQueries.getOrderById(999);
      expect(result).toBeNull();
    });
  });
});
