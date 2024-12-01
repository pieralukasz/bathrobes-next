import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
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

  console.log("Authorized cron job executed successfully");
  return Response.json({ success: "I am cron" });
}
