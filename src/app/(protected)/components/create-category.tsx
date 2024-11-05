"use client";

import { revalidatePath } from "next/cache";
import { useState } from "react";
import { createCategory } from "./create-category-action";
import { useRouter } from "next/navigation";

export const CreateCategory = () => {
  const [name, setName] = useState("");
  const router = useRouter();

  return (
    <div>
      <h1>Create Category</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await createCategory(name);
          router.refresh();
        }}
      >
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};
