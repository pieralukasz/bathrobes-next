"use client";

import { Button } from "~/components/ui/button";
import { signOutAction } from "./actions";
import { useAction } from "next-safe-action/hooks";

export const SignOutButton = () => {
  const { execute } = useAction(signOutAction);

  return (
    <Button type="submit" variant="outline" onClick={() => execute()}>
      Sign Out
    </Button>
  );
};
