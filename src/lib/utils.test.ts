import { describe, expect, it } from "vitest";
import { slugCreator } from "./utils";

describe("slugCreator", () => {
  it("should convert basic text to slug format", () => {
    expect(slugCreator("Hello World")).toBe("hello-world");
    expect(slugCreator("This is a test")).toBe("this-is-a-test");
  });

  it("should handle special characters", () => {
    expect(slugCreator("Product!@#$%^&*()")).toBe("product");
    expect(slugCreator("Hello & World")).toBe("hello-world");
    expect(slugCreator("Price: $100")).toBe("price-100");
  });

  it("should handle multiple spaces and dashes", () => {
    expect(slugCreator("multiple   spaces")).toBe("multiple-spaces");
    expect(slugCreator("already-has-dashes")).toBe("already-has-dashes");
    expect(slugCreator("mixed   spaces-and-dashes")).toBe(
      "mixed-spaces-and-dashes",
    );
  });

  it("should handle non-latin characters", () => {
    expect(slugCreator("żółć")).toBe("zolc");
    expect(slugCreator("café")).toBe("cafe");
    expect(slugCreator("über")).toBe("uber");
  });

  it("should handle empty strings and edge cases", () => {
    expect(slugCreator("")).toBe("");
    expect(slugCreator(" ")).toBe("");
    expect(slugCreator("!!!")).toBe("");
  });

  it("should handle numbers and mixed content", () => {
    expect(slugCreator("Product 123")).toBe("product-123");
    expect(slugCreator("100% Cotton")).toBe("100-cotton");
    expect(slugCreator("Size XL-2023")).toBe("size-xl-2023");
  });
});
