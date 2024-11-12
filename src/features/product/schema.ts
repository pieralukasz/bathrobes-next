import { z } from "zod";

export const productDetailsFormSchema = z.object({
  color: z.string().min(1, "Please select a color"),
  size: z.string().min(1, "Please select a size"),
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(9999, "Quantity must be at most 9999"),
});

export type ProductDetailsFormData = z.infer<typeof productDetailsFormSchema>;
