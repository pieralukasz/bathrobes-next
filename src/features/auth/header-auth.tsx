import Link from "next/link";
import { Button } from "../../components/ui/button";
import { createClient } from "~/lib/supabase/server";

interface HeaderAuthProps extends React.PropsWithChildren<{}> {}

export const HeaderAuth = async ({ children }: HeaderAuthProps) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}! {children}
    </div>
  ) : (
    <Button asChild size="sm" variant={"outline"}>
      <Link href="/sign-in">Sign in</Link>
    </Button>
  );
};
