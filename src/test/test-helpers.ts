import { faker } from "@faker-js/faker";
import type {
  InferProduct,
  InferProductColor,
  InferProductSize,
} from "../server/db/schema";

export function createMockCategory(overrides = {}) {
  return {
    id: faker.number.int({ min: 1, max: 100 }),
    name: faker.commerce.department(),
    slug: faker.helpers.slugify(faker.commerce.department()).toLowerCase(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createMockProduct(overrides = {}): InferProduct {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.commerce.productName(),
    slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
    description: faker.commerce.productDescription(),
    categoryId: faker.number.int({ min: 1, max: 10 }),
    isFeatured: faker.datatype.boolean(),
    isNewArrival: faker.datatype.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
}

export function createMockProductColor(
  productId: number,
  overrides = {},
): InferProductColor {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    productId,
    color: faker.color.human(),
    imageUrl: faker.image.url(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
}

export function createMockProductSize(
  colorId: number,
  overrides = {},
): InferProductSize {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    colorId,
    size: faker.helpers.arrayElement(["XS", "S", "M", "L", "XL", "XXL"]),
    ean: faker.string.numeric(13),
    quantity: faker.number.int({ min: 0, max: 100 }),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
}
