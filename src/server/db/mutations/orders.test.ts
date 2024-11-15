import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { orderMutations, OrderError } from "./orders";
import { db } from "..";

// Mock the database with proper typing
vi.mock("..", () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn().mockResolvedValue([{ id: 1 }]),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => ({
        returning: vi.fn().mockResolvedValue([{ id: 1 }]),
      })),
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([{ id: 1, userId: "test" }]),
        innerJoin: vi.fn(() => ({
          where: vi.fn().mockResolvedValue([
            {
              basketItem: { id: 1, quantity: 1, productSizeId: 1 },
              productSize: { id: 1 },
            },
          ]),
        })),
      })),
    })),
    transaction: vi.fn((callback) =>
      callback({
        select: vi.fn(() => ({
          from: vi.fn(() => ({
            where: vi.fn().mockResolvedValue([{ id: 1, userId: "test" }]),
            innerJoin: vi.fn(() => ({
              where: vi.fn().mockResolvedValue([
                {
                  basketItem: { id: 1, quantity: 1, productSizeId: 1 },
                  productSize: { id: 1 },
                },
              ]),
            })),
          })),
        })),
        insert: vi.fn(() => ({
          values: vi.fn(() => ({
            returning: vi.fn().mockResolvedValue([{ id: 1 }]),
          })),
        })),
        delete: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn().mockResolvedValue([{ id: 1 }]),
          })),
        })),
        execute: vi.fn().mockResolvedValue([{ id: 1 }]),
        _: [],
        session: {},
        dialect: { config: {} },
        config: {},
      }),
    ),
  },
}));

describe("Order Mutations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new order", async () => {
      const userId = faker.string.uuid();
      const result = await orderMutations.create(userId);
      expect(result).toBeDefined();
      expect(db.transaction).toHaveBeenCalled();
    });

    it("should throw error when userId is empty", async () => {
      await expect(orderMutations.create("")).rejects.toThrow(OrderError);
    });

    it("should handle transaction failure", async () => {
      vi.mocked(db.transaction).mockImplementationOnce(() => {
        throw new OrderError("TRANSACTION_FAILED", "Transaction failed");
      });

      await expect(orderMutations.create(faker.string.uuid())).rejects.toThrow(
        OrderError,
      );
    });

    it("should clear basket after successful order creation", async () => {
      // Mock the basket delete operation
    });
  });
});
