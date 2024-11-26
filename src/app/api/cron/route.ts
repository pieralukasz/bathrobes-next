import type { NextApiRequest, NextApiResponse } from "next";
import { seedDatabase } from "~/server/db/seed";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await seedDatabase();
    res.status(200).json({ message: "Database seeded successfully." });
  } catch (error) {
    res.status(500).json({ error: "Seeding failed." });
  }
}
