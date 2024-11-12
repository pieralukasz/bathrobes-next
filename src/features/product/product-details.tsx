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
import { Input } from "~/components/ui/input";
import { useMemo } from "react";
import { ProductWithDetails } from "~/server/db/queries/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addToCartAction } from "../cart/actions";
import {
  productDetailsFormSchema,
  type ProductDetailsFormData,
} from "./schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { useAction } from "next-safe-action/hooks";

interface ProductDetailsProps {
  product: ProductWithDetails;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  if (!product) return null;

  const form = useForm<ProductDetailsFormData>({
    resolver: zodResolver(productDetailsFormSchema),
    defaultValues: {
      color: product.colors[0]?.color || "",
      size: product.colors[0]?.sizes[0]?.size || "",
      quantity: 1,
    },
  });

  const { execute } = useAction(addToCartAction);

  const selectedColor = form.watch("color");

  const sizes = useMemo(() => {
    const color = product.colors.find((color) => color.color === selectedColor);
    return color?.sizes ?? [];
  }, [selectedColor, product.colors]);

  const onSubmit = async (data: ProductDetailsFormData) => {
    const selectedColor = product.colors.find((c) => c.color === data.color);
    const selectedSize = selectedColor?.sizes.find((s) => s.size === data.size);

    if (!selectedSize) return;

    execute({
      productSizeId: selectedSize.id,
      quantity: data.quantity,
    });
  };

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <div className="flex gap-4">
        <div className="flex w-1/2 items-center justify-center p-8">
          <img
            src="https://alfxflqvzegvbpsvtzih.supabase.co/storage/v1/object/public/photos/2018_patti_grafit.png"
            alt={product.name}
          />
        </div>
        <div className="flex w-1/2 flex-col justify-center">
          <CardHeader className="pb-4">
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.category.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-wrap items-center gap-2"
                        >
                          {product.colors.map((color) => (
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex items-center gap-2"
                        >
                          {sizes.map((size) => (
                            <Label
                              key={size.id}
                              htmlFor={`size-${size.size}`}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="w-24"
                          min={1}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="mt-4" disabled={!sizes.length}>
                  Add to cart
                </Button>
              </form>
            </Form>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};
