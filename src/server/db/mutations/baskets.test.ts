import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { basketMutations, BasketError } from "./baskets";
import { db } from "..";

// Mock the database
vi.mock("..", () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn().mockResolvedValue([{ id: 1 }]),
        onConflictDoUpdate: vi.fn().mockResolvedValue([{ id: 1 }]),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => ({
        returning: vi.fn().mockResolvedValue([{ id: 1 }]),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([{ id: 1 }]),
      })),
    })),
    transaction: vi.fn((callback) =>
      callback({
        execute: vi.fn().mockResolvedValue([{ id: 1 }]),
      }),
    ),
  },
}));

describe("Basket Mutations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new basket", async () => {
      const userId = faker.string.uuid();
      const result = await basketMutations.create(userId);
      expect(result).toBeDefined();
      expect(db.insert).toHaveBeenCalled();
    });

    it("should throw error when userId is empty", async () => {
      await expect(basketMutations.create("")).rejects.toThrow(BasketError);
    });
  });

  describe("addItems", () => {
    it("should add items to basket", async () => {
      const items = [
        { productSizeId: 1, quantity: 2 },
        { productSizeId: 2, quantity: 1 },
      ];
      const result = await basketMutations.addItems(1, items);
      expect(result).toBeDefined();
      expect(db.insert).toHaveBeenCalled();
    });

    it("should throw error when no items provided", async () => {
      await expect(basketMutations.addItems(1, [])).rejects.toThrow(
        BasketError,
      );
    });
  });

  describe("removeItems", () => {
    it("should remove single item", async () => {
      const result = await basketMutations.removeItems([1]);
      expect(result).toBeDefined();
      expect(db.delete).toHaveBeenCalled();
    });

    it("should remove multiple items", async () => {
      const result = await basketMutations.removeItems([1, 2, 3]);
      expect(result).toBeDefined();
      expect(db.delete).toHaveBeenCalled();
    });
  });

  describe("updateItems", () => {
    it("should update item quantities", async () => {
      const updates = [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 3 },
      ];
      const result = await basketMutations.updateItems(updates);

      expect(result).toBeDefined();
      expect(db.update).toHaveBeenCalled();
    });
  });
});
