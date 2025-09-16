import { fetchJSON } from "./utils";

type ESPNCollection<T> = {
  items?: (string | { $ref: string })[];
};

type ESPNStandingItem = {
  team?: {
    displayName?: string;
  };
  stats?: {
    name: string;
    value: number;
  }[];
};

type TeamStanding = {
  team: string;
  wins: number;
  losses: number;
};

export async function fetchStandings(base: string): Promise<TeamStanding[]> {
  const root = await fetchJSON<ESPNCollection<ESPNStandingItem>>(base);

  const first = root.items?.[0];
  const firstUrl =
    typeof first === "string"
      ? first
      : typeof first === "object" && first.$ref
      ? first.$ref
      : null;

  if (!firstUrl) return [];

  const standingsSet = await fetchJSON<{ entries: ESPNCollection<ESPNStandingItem> }>(firstUrl);

  const entries = standingsSet.entries?.items ?? [];
  const results: TeamStanding[] = [];

  for (const entry of entries) {
    const entryUrl =
      typeof entry === "string"
        ? entry
        : typeof entry === "object" && entry.$ref
        ? entry.$ref
        : null;

    if (!entryUrl) continue;

    const teamData = await fetchJSON<ESPNStandingItem>(entryUrl);

    const teamName = teamData.team?.displayName ?? "Unknown";
    const wins = team
