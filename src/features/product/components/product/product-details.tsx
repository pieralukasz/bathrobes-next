"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  categories,
  productColors,
  productSizes,
  products,
} from "~/server/db/schema";
import { useMemo, useState } from "react";

type Category = typeof categories.$inferSelect;
type ProductColor = typeof productColors.$inferSelect;
type ProductSize = typeof productSizes.$inferSelect;

// TODO: export it somewhere
export type ProductWithDetails = typeof products.$inferSelect & {
  category: Category;
  colors: (ProductColor & {
    sizes: ProductSize[];
  })[];
};

interface ProductDetailsProps {
  product: ProductWithDetails;
}

// TODO: rewrite it to use react hook form

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.color);

  const sizes = useMemo(() => {
    const color = product.colors.find((color) => color.color === selectedColor);

    return color?.sizes ?? [];
  }, [selectedColor]);

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <div className="flex gap-4">
        <div className="flex w-1/2 items-center justify-center p-8">
          <img src="https://alfxflqvzegvbpsvtzih.supabase.co/storage/v1/object/public/photos/2018_patti_grafit.png" />
        </div>
        <div className="flex w-1/2 flex-col justify-center">
          <CardHeader className="pb-4">
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.category.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <RadioGroup
                  id="color"
                  defaultValue={product.colors[0]?.color}
                  className="flex flex-wrap items-center gap-2"
                  onValueChange={(value) => setSelectedColor(value)}
                  value={selectedColor}
                >
                  {product.colors.map((color, colorIndex) => (
                    <Label
                      key={color.id}
                      htmlFor={`color-${color.color}`}
                      className="flex cursor-pointer items-center gap-2 rounded-md border p-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800"
                    >
                      <RadioGroupItem
                        id={`color-${color.color}`}
                        value={color.color}
                      />
                      {color.color}
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="size">Size</Label>
                <RadioGroup
                  id="size"
                  defaultValue={sizes[0]?.size}
                  className="flex items-center gap-2"
                >
                  {sizes.map((size) => (
                    <Label
                      htmlFor={`size-${size.size}`}
                      key={size.id}
                      className="flex cursor-pointer items-center gap-2 rounded-md border p-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800"
                    >
                      <RadioGroupItem
                        id={`size-${size.size}`}
                        value={size.size}
                      />
                      {size.size}
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  type="number"
                  id="quantity"
                  defaultValue="0"
                  min="0"
                  className="w-24"
                />
              </div>
              <Button size="lg" className="mt-4">
                Add to cart
              </Button>
            </form>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};
