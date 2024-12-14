import { NextResponse } from "next/server";
import { seedDatabase } from "~/server/db/seed";
import { headers } from "next/headers";

const SEED_SECRET = process.env.SEED_SECRET;

export async function POST() {
  const headersList = await headers();
  const authorization = headersList.get("authorization");

  const response = new NextResponse();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type",
  );

  if (!SEED_SECRET) {
    return NextResponse.json(
      { error: "SEED_SECRET environment variable not configured" },
      {
        status: 500,
        headers: response.headers,
      },
    );
  }

  if (!authorization) {
    return NextResponse.json(
      { error: "Missing Authorization header" },
      {
        status: 401,
        headers: response.headers,
      },
    );
  }

  if (authorization !== `Bearer ${SEED_SECRET}`) {
    return NextResponse.json(
      { error: "Invalid authorization token" },
      {
        status: 401,
        headers: response.headers,
      },
    );
  }

  try {
    await seedDatabase();
    return NextResponse.json({ success: true }, { headers: response.headers });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seeding failed" },
      {
        status: 500,
        headers: response.headers,
      },
    );
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type",
  );
  return response;
}
