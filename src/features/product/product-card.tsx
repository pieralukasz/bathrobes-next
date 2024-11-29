"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "~/components/ui/card";
import { ProductWithDetails } from "./product-details";
import { getMaybeImageUrl, defaultImageUrl } from "./utils";

interface ProductCardProps {
  product: ProductWithDetails;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();

  const availableImage = product?.colors
    .flatMap((color) => color.imageUrl)
    .filter((url) => url)[0];

  if (!product) {
    return null;
  }

  const name = product.name;
  const firstColor = product.colors[0]?.color;

  const imageSupabasePath = getMaybeImageUrl(name, firstColor);

  const handleClick = () => {
    router.push(`/product/${product.slug}`);
  };

  const productPrice =
    Number(product.price) % 1 === 0 ? Number(product.price) : product.price;

  return (
    <Card
      className="hover:scale-101 group relative mx-auto w-full max-w-md transform cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="relative flex h-52 w-full items-center justify-center">
          <div className="absolute left-0 top-0 m-1">
            <span className="bg-gray rounded px-2 py-1 text-xs text-gray-300">
              {productPrice}
            </span>
          </div>
          <img
            src={availableImage || imageSupabasePath}
            defaultValue={defaultImageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = defaultImageUrl;
            }}
          />
        </div>
        <div className="p-2 text-center">
          <p className="truncate text-xs">{product.name}</p>
        </div>
      </CardContent>
    </Card>
  );
};
