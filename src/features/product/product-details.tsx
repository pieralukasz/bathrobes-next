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
import { useMemo } from "react";
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
import { productQueries } from "~/server/db/queries";
import { IncrementorInput } from "~/components/ui/incrementor-input";
import { toast } from "sonner";
import { defaultImageUrl, getMaybeImageUrl } from "./utils";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export type ProductWithDetails = Awaited<
  NonNullable<ReturnType<typeof productQueries.getProductBySlug>>
>;

interface ProductDetailsProps {
  product: ProductWithDetails;
  ean?: string;
}

const getProductDefaultsByEan = (product: ProductWithDetails, ean?: string) => {
  if (!ean)
    return {
      defaultColor: null,
      defaultSize: null,
    };

  const color = product?.colors?.find((color) =>
    color.sizes.some((size) => size.ean === ean),
  );

  const size = color?.sizes.find((size) => size.ean === ean);

  return {
    defaultColor: color,
    defaultSize: size,
  };
};

const cleanSizeString = (size: string) => {
  return size.replace(/['"]/g, "").trim();
};

export const ProductDetails = ({ product, ean }: ProductDetailsProps) => {
  const router = useRouter();

  if (!product) return null;

  // Filter out colors that have no available sizes
  const availableColors = product.colors.filter(
    (color) => color.sizes.length > 0,
  );

  // Update the default values to use first available color
  const { defaultColor, defaultSize } = getProductDefaultsByEan(product, ean);

  const { cart, addCartItem } = useCart();
  const form = useForm<ProductDetailsFormData>({
    resolver: zodResolver(productDetailsFormSchema),
    defaultValues: {
      color: defaultColor?.color || availableColors[0]?.color || "",
      size: defaultSize?.size || availableColors[0]?.sizes[0]?.size || "",
      quantity: (() => {
        const initialSize = defaultSize || availableColors[0]?.sizes[0];

        if (!cart || !initialSize) return 1;

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
    const color = availableColors.find(
      (color) => color.color === selectedColor,
    );
    return color?.sizes ?? [];
  }, [selectedColor, availableColors]);

  const existingCartItem = useMemo(() => {
    if (!cart || !selectedColor || !selectedSize) return null;

    const color = availableColors.find((c) => c.color === selectedColor);
    const size = color?.sizes.find((s) => s.size === selectedSize);

    return cart.items.find((item) => item.productSizeId === size?.id);
  }, [cart, selectedColor, selectedSize, availableColors]);

  const getButtonText = () => {
    if (existingCartItem) return "Update cart";
    return "Add to cart";
  };

  const imageUrl = availableColors.find(
    (c) => c.color === selectedColor,
  )?.imageUrl;

  const maybeImageUrl = useMemo(() => {
    return getMaybeImageUrl(product.name, selectedColor);
  }, [product.name, selectedColor]);

  const onSubmit = async (data: ProductDetailsFormData) => {
    const selectedColor = availableColors.find((c) => c.color === data.color);
    const selectedSize = selectedColor?.sizes.find((s) => s.size === data.size);

    if (!selectedSize) return;

    addCartItem(selectedSize.id, data.quantity, selectedSize, product);

    execute({
      productSizeId: selectedSize.id,
      quantity: data.quantity,
    });

    toast.success("Cart updated", {
      duration: 1000,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <button
        onClick={() => router.back()}
        aria-label="Go Back"
        className="flex h-8 w-8 items-center justify-center"
      >
        <ArrowLeftIcon className="h-6 w-6" />
      </button>
      <Card className="mx-auto w-full max-w-3xl">
        <div className="relative flex gap-4">
          <div className="flex w-1/2 items-center justify-center p-8">
            <img
              src={imageUrl ?? maybeImageUrl}
              alt={product.name}
              className="h-full w-full object-cover sm:h-[500px] sm:w-[400px]"
              onError={(e) => {
                e.currentTarget.src = defaultImageUrl;
              }}
            />
          </div>
          <div className="relative flex w-1/2 flex-col justify-center">
            <CardHeader className="pb-4">
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.category?.name}</CardDescription>
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
                            {availableColors.map((color) => (
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
                                {cleanSizeString(size.size)}
                              </Label>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <div className="max-w-[138px]">
                            <FormControl className="w-20">
                              <IncrementorInput
                                min={1}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="mt-4"
                    disabled={!sizes.length}
                  >
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
    </div>
  );
};
