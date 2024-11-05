import { CategoriesList } from "./components/categories-list";

export default async function HomePage() {
  return (
    <div className="mx-auto w-full">
      <h1 className="mb-6 text-center text-3xl font-bold">Categories</h1>
      <CategoriesList />
    </div>
  );
}
