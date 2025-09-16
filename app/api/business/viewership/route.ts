import { NextResponse } from "next/server";
export const revalidate = 3600;
export async function GET() {
  const data = await import("@/data/business/viewership_2025.json");
  return NextResponse.json({ ok: true, ...data });
}
