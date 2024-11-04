"use client";

import { Input } from "~/components/ui/input";
import Link from "next/link";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { signInFormSchema } from "./schema";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInAction } from "./sign-in-action";

export const SignInForm = () => {
  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(signInAction, zodResolver(signInFormSchema), {
      formProps: {
        mode: "onChange",
      },
      actionProps: {
        onSuccess: () => {
          window.alert("Logged in successfully!");
          resetFormAndAction();
        },
      },
    });

  if (!form.control) {
    return null;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmitWithAction}
        className="flex min-w-64 flex-1 flex-col gap-3"
      >
        <h1 className="text-2xl font-medium">Sign in</h1>
        <p className="text-sm text-foreground">
          Don't have an account?{" "}
          <Link
            className="font-medium text-foreground underline"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
