import * as z from "zod";

export const addToCartSchema = z.object({
  productSizeId: z.number(),
  quantity: z.number().min(1),
});

export const updateCartSchema = z.object({
  basketItemId: z.number(),
  quantity: z.number().min(0),
});

export const removeItemSchema = z.object({
  basketItemId: z.number(),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartInput = z.infer<typeof updateCartSchema>;
export type RemoveItemInput = z.infer<typeof removeItemSchema>;
