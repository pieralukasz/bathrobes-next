import type { NextRequest } from "next/server";
import { seedDatabase } from "~/server/db/seed";

export async function GET(request: NextRequest) {
  console.log("Received request to /api/cron");

  const authHeader = request.headers.get("authorization");
  if (
    process.env.NODE_ENV === "production" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    console.log("Unauthorized access attempt to /api/cron");
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    await seedDatabase();
    return Response.json({
      success: true,
      message: "Database seeding started",
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return Response.json(
      { success: false, message: "Failed to seed database" },
      { status: 500 },
    );
  }
}
