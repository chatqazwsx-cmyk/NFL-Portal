export type ESPNRef = { $ref?: string, href?: string };
export type ESPNCollection<T> = { items?: T[]; count?: number };
export type ESPNStandingItem = { team: ESPNRef; stats: Array<{ name: string; value: number | string }>; note?: { color?: string; description?: string } };
export type TeamStanding = { teamId: string; team: string; abbr: string; wins: number; losses: number; ties: number; pct: number; streak?: string };

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { "User-Agent": "portal-nfl/1.0 (+https://example.com)" }, cache: "no-store" });
  if (!res.ok) throw new Error(`ESPN fetch error ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

export async function fetchStandings(year: number, type = 2, group = 1): Promise<TeamStanding[]> {
  const base = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${year}/types/${type}/groups/${group}/standings`;
  const root = await fetchJSON<ESPNCollection<{ $ref: string }>>(base);
  const first = root.items?.[0]?.$ref ?? root.items?.[0];
  const standingsSet = await fetchJSON<{ entries: ESPNCollection<ESPNStandingItem> }>(typeof first === "string" ? first : (first ?? ""));
  const entries = standingsSet.entries?.items ?? [];
  const results: TeamStanding[] = [];
  const chunks: ESPNStandingItem[][] = []; const size = 8;
  for (let i = 0; i < entries.length; i += size) chunks.push(entries.slice(i, i + size));
  for (const ch of chunks) {
    const metas = await Promise.all(ch.map(async (e) => {
      const tUrl = (e.team.$ref || e.team.href)!;
      const t = await fetchJSON<any>(tUrl);
      const display = t?.displayName || `${t?.location ?? ""} ${t?.name ?? ""}`.trim();
      const abbr = t?.abbreviation ?? "";
      const teamId = String(t?.id ?? "");
      const get = (name: string) => e.stats.find(x => x.name === name)?.value as number | string | undefined;
      const wins = Number(get("wins") ?? 0);
      const losses = Number(get("losses") ?? 0);
      const ties = Number(get("ties") ?? 0);
      const pct = Number(get("winPercent") ?? 0);
      const streak = String(get("streak") ?? "") || undefined;
      return <TeamStanding>{ teamId, team: display, abbr, wins, losses, ties, pct, streak };
    }));
    results.push(...metas);
  }
  return results;
}
