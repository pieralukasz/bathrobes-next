import { NextResponse } from "next/server";
import { seedDatabase } from "~/server/db/seed";

export async function GET(request: Request, response: Response) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({
      error: "Unauthorized, only vercel can access",
      status: 401,
    });
  }

  try {
    await seedDatabase();
    return NextResponse.json({ status: 200, message: "Database updated" });
  } catch (error) {
    return NextResponse.json({ status: 500, error: "Internal server error" });
  }
}
