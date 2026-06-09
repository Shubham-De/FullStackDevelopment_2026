import { seed } from "@repo/db/seed";
import { NextResponse } from "next/server";

export async function GET() {
  await seed();
  return NextResponse.json({ success: true });
}