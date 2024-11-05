"use cache";

import { CreateCategory } from "./components/create-category";
import { CategoriesList } from "./components/categories-list";
import { Suspense } from "react";

export default async function HomePage() {
  return (
    <div className="mx-auto w-full">
      <h1 className="mb-6 text-center text-3xl font-bold">Categories</h1>
      <CategoriesList />
      <CreateCategory />
    </div>
  );
}
