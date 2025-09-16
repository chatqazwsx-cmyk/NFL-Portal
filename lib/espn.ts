export type ESPNScoreboard = {
  events: Array<{
    id: string; name: string; shortName: string; date: string;
    competitions: Array<{
      status: { type: { state: string; completed: boolean; description: string } };
      competitors: Array<{
        id: string;
        team: { id: string; location: string; name: string; abbreviation: string; logo?: string };
        score: string; homeAway: "home" | "away"; winner?: boolean;
      }>; venue?: { fullName?: string };
    }>; links?: Array<{ href: string; text?: string; rel?: string[] }>;
  }>;
};
export type GameCard = {
  id: string; name: string; shortName: string; date: string; state: string; completed: boolean; description: string; venue?: string;
  home: { abbr: string; name: string; score?: number; winner?: boolean };
  away: { abbr: string; name: string; score?: number; winner?: boolean };
  boxscoreUrl?: string;
};
export function mapScoreboardToCards(json: ESPNScoreboard): GameCard[] {
  const cards: GameCard[] = [];
  for (const ev of json.events ?? []) {
    const comp = ev.competitions?.[0];
    if (!comp) continue;
    const status = comp.status?.type ?? { state: "pre", description: "" };
    const home = comp.competitors?.find(c => c.homeAway === "home");
    const away = comp.competitors?.find(c => c.homeAway === "away");
    const toTeam = (c?: any) => ({
      abbr: c?.team?.abbreviation ?? "", name: `${c?.team?.location ?? ""} ${c?.team?.name ?? ""}`.trim(),
      score: typeof c?.score === "string" ? Number(c.score) : c?.score, winner: Boolean(c?.winner),
    });
    cards.push({
      id: ev.id, name: ev.name, shortName: ev.shortName, date: ev.date, state: status.state, completed: Boolean(status.completed),
      description: status.description ?? "", venue: comp.venue?.fullName, home: toTeam(home), away: toTeam(away),
      boxscoreUrl: ev.links?.find(l => l.rel?.includes("boxscore"))?.href
    });
  }
  return cards;
}
// --- util común para pedir JSON con tipado ---
export async function fetchJSON<T = unknown>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      ...(init?.headers as Record<string, string> | undefined),
    },
    cache: "no-store",
    ...init,
  });

  if (!res.ok) {
    let body = "";
    try { body = await res.text(); } catch {}
    const snippet = body.slice(0, 300);
    throw new Error(
      `fetchJSON: ${res.status} ${res.statusText} – ${url}\n` + (snippet ? snippet : "")
    );
  }

  return (await res.json()) as T;
}
