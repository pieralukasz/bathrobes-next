"use client";

import { Input } from "~/components/ui/input";
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
import { signInAction } from "./actions";

export const SignInForm = () => {
  const { form, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(signInAction, zodResolver(signInFormSchema), {
      formProps: {
        mode: "onChange",
      },
      actionProps: {
        onSuccess: () => {
          window.alert("You've got mail!");
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
        className="flex w-full flex-1 flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="ll@bathrobe.com" {...field} />
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
