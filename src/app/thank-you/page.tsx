import Link from "next/link";
import { Button } from "~/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-8 py-16 text-center">
      <div className="flex flex-col items-center gap-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h1 className="text-3xl font-bold">Thank You for Your Order!</h1>
        <p className="text-muted-foreground">
          We've received your order and will send you an email confirmation
          shortly.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Button asChild size="lg">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
