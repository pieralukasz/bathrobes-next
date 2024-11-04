"use client";

import { Form } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { signOutAction } from "./sign-out-action";
import { useAction } from "next-safe-action/hooks";

export const SignOutForm = () => {
  const { execute } = useAction(signOutAction);

  return (
    <form onSubmit={() => execute()}>
      <Button variant="outline">Sign Out</Button>
    </form>
  );
};
