import { NextResponse } from "next/server";
export const revalidate = 3600;
async function fetchLocal(season: number, week: number) {
  try { const mod = await import(`@/data/players_of_week/${season}_week_${week}.json`); return mod.default ?? mod; } catch { return null; }
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const season = Number(searchParams.get("season") ?? new Date().getFullYear());
  const week = Number(searchParams.get("week") ?? 1);
  const url = searchParams.get("url");
  if (url) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "portal-nfl/1.0 (+https://example.com)" } });
      const html = await res.text();
      const cheerio = await import("cheerio");
      const $ = cheerio.load(html);
      const items: any[] = [];
      $("h3, li").each((_, el) => {
        const t = $(el).text().trim();
        const m = t.match(/(AFC|NFC)\s+(Ofensivo|Offensivo|Defensivo|Equipos Especiales).*?:\s*(.+?)\s*\((.+?)\)/i);
        if (m) items.push({ conference: m[1].toUpperCase(), category: m[2], player: m[3], team: m[4] });
      });
      if (items.length) return NextResponse.json({ ok: true, season, week, items, source: url });
    } catch {}
  }
  const data = await fetchLocal(season, week);
  if (data) return NextResponse.json({ ok: true, season, week, items: data.items, source: data.source });
  return NextResponse.json({ ok: true, season, week, items: [], source: null });
}
