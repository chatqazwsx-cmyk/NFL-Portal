import { NextResponse } from "next/server";
export const revalidate = 60;
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dates = searchParams.get("dates");
  const week = searchParams.get("week");
  const seasontype = searchParams.get("seasontype");
  const base = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
  const qs = new URLSearchParams();
  if (dates) qs.set("dates", dates);
  if (week) qs.set("week", week);
  if (seasontype) qs.set("seasontype", seasontype);
  const url = qs.toString() ? `${base}?${qs.toString()}` : base;
  const res = await fetch(url, { next: { revalidate: 60 }, headers: { "User-Agent": "portal-nfl/1.0 (+https://example.com)" } });
  if (!res.ok) return NextResponse.json({ error: `Upstream error ${res.status}`, url }, { status: 502 });
  const json = await res.json();
  return NextResponse.json({ ok: true, upstream: url, data: json });
}
