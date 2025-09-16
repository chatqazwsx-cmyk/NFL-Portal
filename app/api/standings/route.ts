import { NextResponse } from "next/server";
import { fetchStandings } from "@/lib/espnStandings";
export const revalidate = 600;
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const season = Number(searchParams.get("season") ?? new Date().getFullYear());
  const type = Number(searchParams.get("type") ?? 2);
  const group = Number(searchParams.get("group") ?? 1);
  try {
    const rows = await fetchStandings(season, type, group);
    return NextResponse.json({ ok: true, season, type, group, rows });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
