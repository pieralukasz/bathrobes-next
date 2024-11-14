import Link from "next/link";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

export default async function HomePage() {
  return (
    <div className="mb-10 flex flex-grow flex-col items-center justify-center space-y-6 px-2 text-center">
      <Image src={`/logo.jpg`} alt="logo" width="128" height="128" />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
        Welcome to L&L Bathrobes
      </h1>
      <div className="max-w-2xl">
        <p className="mb-4 text-xl text-gray-600 dark:text-gray-300">
          Your trusted partner for bulk bathrobe orders
        </p>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Start exploring our products using the search bar at the top or click
          the button below
        </p>
      </div>
      <ArrowDown className="h-6 w-6 animate-bounce" />
      <Button asChild>
        <Link href="/search" className="flex items-center gap-2">
          Search
        </Link>
      </Button>
    </div>
  );
}
