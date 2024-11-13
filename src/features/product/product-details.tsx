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
import { useCart } from "../cart/cart-context";

interface ProductDetailsProps {
  product: ProductWithDetails;
  defaultColor?: string;
  defaultSize?: string;
}

export const ProductDetails = ({
  product,
  defaultColor,
  defaultSize,
}: ProductDetailsProps) => {
  if (!product) return null;

  const { cart, addCartItem } = useCart();
  const form = useForm<ProductDetailsFormData>({
    resolver: zodResolver(productDetailsFormSchema),
    defaultValues: {
      color: defaultColor || product.colors[0]?.color || "",
      size: defaultSize || product.colors[0]?.sizes[0]?.size || "",
      quantity: (() => {
        const initialColor = product.colors.find(
          (c) => c.color === (defaultColor || product.colors[0]?.color),
        );
        const initialSize = initialColor?.sizes.find(
          (s) => s.size === (defaultSize || initialColor?.sizes[0]?.size),
        );
        if (!cart || !initialColor || !initialSize) return 1;

        const existingItem = cart.items.find(
          (item) => item.productSizeId === initialSize.id,
        );
        return existingItem?.quantity || 1;
      })(),
    },
  });

  const { execute } = useAction(addToCartAction);

  const selectedColor = form.watch("color");
  const selectedSize = form.watch("size");

  const sizes = useMemo(() => {
    const color = product.colors.find((color) => color.color === selectedColor);
    return color?.sizes ?? [];
  }, [selectedColor, product.colors]);

  const existingCartItem = useMemo(() => {
    if (!cart || !selectedColor || !selectedSize) return null;

    const color = product.colors.find((c) => c.color === selectedColor);
    const size = color?.sizes.find((s) => s.size === selectedSize);

    return cart.items.find((item) => item.productSizeId === size?.id);
  }, [cart, selectedColor, selectedSize, product.colors]);

  const getButtonText = () => {
    if (existingCartItem) return "Update cart";
    return "Add to cart";
  };

  const onSubmit = async (data: ProductDetailsFormData) => {
    const selectedColor = product.colors.find((c) => c.color === data.color);
    const selectedSize = selectedColor?.sizes.find((s) => s.size === data.size);

    if (!selectedSize) return;

    addCartItem(selectedSize.id, data.quantity, selectedSize, product);

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
                  {getButtonText()}
                </Button>

                <p className="mt-2 text-sm text-muted-foreground">
                  Currently in cart: {existingCartItem?.quantity || 0}
                </p>
              </form>
            </Form>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};
