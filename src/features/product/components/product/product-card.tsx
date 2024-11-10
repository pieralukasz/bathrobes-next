"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "~/components/ui/card";
import { products } from "~/server/db/schema";

export type ProductWithDetails = typeof products.$inferSelect;

interface ProductCardProps {
  product: ProductWithDetails;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${product.slug}`);
  };

  return (
    <Card
      className="hover:scale-101 mx-auto w-full max-w-md transform cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] w-full">
          <img
            src="https://alfxflqvzegvbpsvtzih.supabase.co/storage/v1/object/public/photos/2018_patti_grafit.png"
            alt={product.name}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-2 text-center">
          <p className="truncate font-semibold">{product.name}</p>
        </div>
      </CardContent>
    </Card>
  );
};
