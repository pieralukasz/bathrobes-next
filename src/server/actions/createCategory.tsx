"use server";

import { revalidateTag } from "next/cache";
import { db } from "../db";
import { categories } from "../db/schema";

export const createCategory = async (formData: FormData) => {
  try {
    const input = {
      name: formData.get("name") as string,
    };

    await db.insert(categories).values({
      name: input.name,
    });

    revalidateTag("category");
  } catch (error) {
    console.error(
      "Error while creating category:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
};
