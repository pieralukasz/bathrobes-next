"use cache";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { CheckCircle } from "lucide-react";

export default async function ThankYouPage() {
  return (
    <div className="container relative mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-8 py-16 text-center">
      <div className="flex flex-col items-center gap-4">
        <CheckCircle className="h-16 w-16 animate-bounce text-green-500" />
        <h1 className="text-3xl font-bold duration-700">
          Thank You for Your Order!
        </h1>
        <p className="text-muted-foreground">
          We've received your order and will send you an email confirmation
          shortly.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Button asChild size="lg">
          <Link href="/search">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
