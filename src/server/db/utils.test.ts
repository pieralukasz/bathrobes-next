import { describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { parseRawXmlToData, ParsedProduct, RawProduct } from "./utils";

// Mock environment variables
vi.mock("~/env", () => ({
  env: {
    XML_URL: "https://magazyn.szlafroki.com/csv/ArkuszZamowien.xml",
  },
}));

const createMockRawProduct = (): RawProduct => ({
  $: { EAN: faker.string.numeric(13) },
  NazwaKategorii: [faker.commerce.department()],
  Nazwa: [faker.commerce.productName()],
  Kolor: [faker.color.human()],
  Rozmiar: [faker.helpers.arrayElement(["S", "M", "L", "XL"])],
  Ilość: [faker.number.int({ min: 0, max: 100 }).toString()],
});

describe("XML parsing utilities", () => {
  it("should correctly parse raw XML to product data", () => {
    const mockRawProduct = createMockRawProduct();
    const mockXml = {
      Zamówienie: {
        Artykuly: [
          {
            Artykuł: [mockRawProduct],
          },
        ],
      },
    };

    const result = parseRawXmlToData(mockXml);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      ean: mockRawProduct.$.EAN,
      name: mockRawProduct.Nazwa[0],
      categoryName: mockRawProduct.NazwaKategorii[0],
      color: mockRawProduct.Kolor[0],
      size: mockRawProduct.Rozmiar[0],
      quantity:
        mockRawProduct.Ilość[0] && parseInt(mockRawProduct.Ilość[0], 10),
      available: true,
    });
  });

  it("should handle empty quantity", () => {
    const mockRawProduct = createMockRawProduct();
    mockRawProduct.Ilość = [];
    const mockXml = {
      Zamówienie: {
        Artykuly: [
          {
            Artykuł: [mockRawProduct],
          },
        ],
      },
    };

    const result = parseRawXmlToData(mockXml);
    expect(result[0]?.quantity).toBe(0);
  });
});
