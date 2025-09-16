import { fetchJSON } from "./espn";

// En las respuestas de ESPN, los enlaces pueden venir como string o como objeto {$ref|href}
type Link = string | { $ref?: string; href?: string };
const getHref = (x?: Link): string | null =>
  typeof x === "string" ? x : x?.$ref ?? x?.href ?? null;

// Estructuras mínimas que usamos del API de ESPN
type ESPNCollection<T = unknown> = { items?: Link[] } & Record<string, unknown>;
type ESPNStandingItem = {
  team?: Link;
  stats: { name: string; value: number | string }[];
};

export type TeamStanding = {
  team: string;
  wins: number;
  losses: number;
  ties: number;
  pct: number;
  streak?: string;
};

/**
 * Obtiene standings desde ESPN Core API.
 * @param year  Ej: 2025
 * @param type  2 = regular season
 * @param group 1 = liga, 8 divisiones salen en la colección
 */
export async function fetchStandings(
  year: number,
  type = 2,
  group = 1
): Promise<TeamStanding[]> {
  const base = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${year}/types/${type}/groups/${group}/standings`;

  // La primera colección trae items que son strings o {$ref|href}
  const root = await fetchJSON<ESPNCollection>(base);
  const firstUrl = getHref(root.items?.[0]);
  if (!firstUrl) throw new Error("Could not resolve standings reference from ESPN Core.");

  // El set real de standings está en firstUrl
  const standingsSet = await fetchJSON<{ entries: ESPNCollection }>(firstUrl);
  const entries = standingsSet?.entries?.items ?? [];
  const results: TeamStanding[] = [];

  // Recorremos cada entrada del standing
  for (const entry of entries) {
    const entryUrl = getHref(entry);
    if (!entryUrl) continue;

    // Cada 'entry' describe un equipo con stats y un link a 'team'
    const item = await fetchJSON<ESPNStandingItem>(entryUrl);

    // Resolver datos del equipo
    const teamUrl = getHref(item.team);
    let display = "Unknown";
    let abbr = "";
    if (teamUrl) {
      const t = await fetchJSON<any>(teamUrl);
      display = t?.displayName || `${t?.location ?? ""} ${t?.name ?? ""}`.trim();
      abbr = t?.abbreviation ?? "";
    }

    // Helper para leer stats por nombre
    const get = (name: string): number | string | undefined =>
      item.stats?.find((s) => s.name === name)?.value;

    const wins = Number(get("wins") ?? 0);
    const losses = Number(get("losses") ?? 0);
    const ties = Number(get("ties") ?? 0);
    const pct = Number(get("winPercent") ?? 0);
    const rawStreak = get("streak");
    const streak = (typeof rawStreak === "string" ? rawStreak : String(rawStreak ?? "")).trim() || undefined;

    results.push({ team: display || abbr || "Unknown", wins, losses, ties, pct, streak });
  }

  return results;
}
