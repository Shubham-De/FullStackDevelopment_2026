import { seed } from "@repo/db/seed";
import { NextResponse } from "next/server";

export async function GET() {
  // Allow seeding in E2E mode or in development
  if (!process.env.E2E && process.env.NODE_ENV === "production") {
    return new Response("Not Available", { status: 501 });
  }

  await seed();
  return NextResponse.json({ message: "Seeded" }, { status: 200 });
}
