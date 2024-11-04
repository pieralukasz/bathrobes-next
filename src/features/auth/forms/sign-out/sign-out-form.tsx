"use client";

import { Button } from "~/components/ui/button";
import { signOutAction } from "./sign-out-action";
import { useAction } from "next-safe-action/hooks";

export const SignOutForm = () => {
  const { execute } = useAction(signOutAction);

  return (
    <Button type="submit" variant="outline" onClick={() => execute()}>
      Sign Out
    </Button>
  );
};
