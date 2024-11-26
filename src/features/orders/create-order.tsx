"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { AlertCircle, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { createOrderSchema } from "./schema";
import { checkoutAction } from "./actions";

export const CreateOrder = () => {
  const router = useRouter();

  const {
    form,
    handleSubmitWithAction,
    action: { status },
  } = useHookFormAction(checkoutAction, zodResolver(createOrderSchema), {
    actionProps: {
      onSuccess: () => {
        toast.success("Email sent successfully", {
          duration: 5000,
        });
        router.push("/thank-you");
        router.refresh();
      },
      onError: () => {
        toast.error("An error occurred while sending the email", {
          duration: 5000,
        });
      },
    },
  });

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="mb-2 flex items-center gap-2 text-center">
        <ShoppingBag className="h-5 w-5" />
        <span>You'll receive an email with your order details.</span>
      </div>

      {status === "hasErrored" && (
        <div className="flex items-center gap-2 text-center text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p>An error occurred</p>
        </div>
      )}

      {status === "executing" && (
        <div className="flex items-center gap-2 text-center text-blue-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Processing your order...</p>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={handleSubmitWithAction}
          className="flex w-full flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    placeholder="Add a note to your order"
                    disabled={
                      form.formState.isSubmitting ||
                      status === "executing" ||
                      status === "hasSucceeded"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={
              form.formState.isSubmitting ||
              status === "executing" ||
              status === "hasSucceeded"
            }
          >
            Complete Order
          </Button>
        </form>
      </Form>
    </div>
  );
};
