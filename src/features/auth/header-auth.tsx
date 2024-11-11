import Link from "next/link";
import { Button } from "../../components/ui/button";
import { createClient } from "~/lib/supabase/server";

export const HeaderAuth = async () => {
  return (
    <Button asChild size="sm" variant={"outline"}>
      <Link href="/sign-in">Sign in</Link>
    </Button>
  );
};
