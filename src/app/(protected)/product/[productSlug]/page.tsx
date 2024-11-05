import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { products } from "~/server/db/schema";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const productSlug = (await params).productSlug;

  const product = await db.query.products.findFirst({
    where: eq(products.slug, productSlug),
    with: {
      category: true,
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
      <p>Category: {product.category.name}</p>
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
