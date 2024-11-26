import { z } from "zod";

export const createOrderSchema = z.object({
  note: z.string().optional(),
});
