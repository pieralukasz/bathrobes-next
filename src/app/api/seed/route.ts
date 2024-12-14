import { NextResponse } from "next/server";
import { seedDatabase } from "~/server/db/seed";
import { headers } from "next/headers";

const SEED_SECRET = process.env.SEED_SECRET;

export async function POST() {
  const headersList = await headers();
  const authorization = headersList.get("authorization");

  if (!SEED_SECRET || authorization !== `Bearer ${SEED_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await seedDatabase();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
  }
}
