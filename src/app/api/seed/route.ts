import { NextResponse } from "next/server";
import { seedDatabase } from "~/server/db/seed";
import { headers } from "next/headers";

const SEED_SECRET = process.env.SEED_SECRET;

export async function POST() {
  const headersList = headers();
  const authorization = headersList.get("authorization");

  if (!SEED_SECRET) {
    return NextResponse.json(
      { error: "SEED_SECRET environment variable not configured" },
      { status: 500 },
    );
  }

  if (!authorization) {
    return NextResponse.json(
      { error: "Missing Authorization header" },
      { status: 401 },
    );
  }

  if (authorization !== `Bearer ${SEED_SECRET}`) {
    return NextResponse.json(
      { error: "Invalid authorization token" },
      { status: 401 },
    );
  }

  try {
    await seedDatabase();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
  }
}