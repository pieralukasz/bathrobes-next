import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import {
  categories,
  productColors,
  productSizes,
  products,
} from "~/server/db/schema";
import { notFound } from "next/navigation";

type Category = typeof categories.$inferSelect;
type ProductColor = typeof productColors.$inferSelect;
type ProductSize = typeof productSizes.$inferSelect;

type ProductWithDetails = typeof products.$inferSelect & {
  colors: (ProductColor & {
    sizes: ProductSize[];
  })[];
};

export default async function Page({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const productId = (await params).productId;

  if (Number.isNaN(Number(productId))) {
    notFound();
  }

  const product = await db.query.products.findFirst({
    where: eq(products.id, Number(productId)),
    with: {
      colors: {
        with: {
          sizes: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Category: {product.name}</p>
      <div>
        {product.colors.map((color) => (
          <div key={color.id}>
            <h2>{color.color}</h2>
            <ul>
              {color.sizes.map((size) => (
                <li key={size.id}>
                  {size.size} - {size.ean} - {size.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
