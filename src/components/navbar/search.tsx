"use client";

import { SearchIcon } from "lucide-react";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const Search = () => {
  const searchParams = useSearchParams();

  return (
    <Form action="/search" className="relative w-full md:w-1/3 lg:w-80">
      <Input
        key={searchParams?.get("q")}
        type="text"
        name="q"
        placeholder="Search for products..."
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="w-full rounded-lg text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400 md:text-sm"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 mr-3 flex h-full items-center"
      >
        <SearchIcon className="h-4" />
      </button>
    </Form>
  );
};

export const SearchSkeleton = () => {
  return (
    <form className="w-max-[550px] relative w-full md:w-1/3 lg:w-80 xl:w-full">
      <input
        placeholder="Search for products..."
        className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 mr-3 flex h-full items-center"
      >
        <SearchIcon className="h-4" />
      </button>
    </form>
  );
};
