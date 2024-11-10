import * as zod from "zod";

export const signInFormSchema = zod.object({
  email: zod
    .string()
    .max(64)
    .email("Please use a valid email address (name@domain.com)"),
});

export type SignInFormValues = zod.infer<typeof signInFormSchema>;
