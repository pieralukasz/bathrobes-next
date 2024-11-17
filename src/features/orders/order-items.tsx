import Link from "next/link";
import { cn, createUrl } from "~/lib/utils";

interface OrderItemsProps {
  items: any[];
}

export const OrderItems = ({ items }: OrderItemsProps) => {
  return (
    <div className="flex h-[calc(100%-128px)] flex-col justify-between overflow-hidden">
      <ul className="mb-2 flex-grow overflow-auto p-4">
        {items.map((item, i) => {
          const params = new URLSearchParams({
            ean: item.productSize.ean,
          });

          const productUrl = createUrl(
            `/product/${item.productSize.color.product.slug}`,
            params,
          );

          return (
            <li
              key={i}
              className={cn(
                "flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700",
                i === items.length - 1 ? "border-b-0" : "",
              )}
            >
              <div className="flex w-full justify-between px-1 py-4">
                <Link
                  href={productUrl}
                  className="flex flex-row items-center justify-start"
                >
                  <div className="relative w-16 border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                    <img
                      src="https://alfxflqvzegvbpsvtzih.supabase.co/storage/v1/object/public/photos/2018_patti_grafit.png"
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="ml-2 flex flex-row space-x-4">
                    <div className="flex flex-1 flex-col text-base">
                      <span className="font-bold">
                        {item.productSize.color.product.name}
                      </span>
                      <span className="text-sm">
                        {item.productSize.color.color}
                      </span>
                      <span className="text-sm">{item.productSize.size}</span>
                    </div>
                  </div>
                </Link>
                <div className="flex flex-row items-center justify-end">
                  <span className="mr-2 text-xl font-bold">
                    {item.quantity}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
