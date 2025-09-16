import Link from "next/link";
import GameCard from "@/components/GameCard";
import NewsCard from "@/components/NewsCard";
import StandingsTable from "@/components/StandingsTable";
import DivisionGrid from "@/components/DivisionGrid";
import BusinessCard from "@/components/BusinessCard";
import { baseUrl } from "@/lib/baseUrl";
import { mapScoreboardToCards, type ESPNScoreboard } from "@/lib/espn";
import { META_BY_ABBR } from "@/lib/teamMeta";

async function fetchScoreboard() {
  const res = await fetch(`${baseUrl()}/api/scoreboard`, { next: { revalidate: 60 } });
  if (!res.ok) return { games: [], upstream: "" };
  const json = await res.json();
  const data = json.data as ESPNScoreboard;
  const games = mapScoreboardToCards(data);
  return { games, upstream: json.upstream as string };
}

async function fetchStandings() {
  const res = await fetch(`${baseUrl()}/api/standings?season=2025&type=2&group=1`, { next: { revalidate: 600 } });
  if (!res.ok) return { rows: [] as any[] };
  const json = await res.json();
  return { rows: json.rows as any[] };
}

async function fetchPlayersOfWeek() {
  const res = await fetch(`${baseUrl()}/api/players-of-week?season=2025&week=1`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const json = await res.json();
  return json.items as Array<{ conference: string; category: string; player: string; team: string; position?: string }>;
}

async function fetchViewership() {
  const res = await fetch(`${baseUrl()}/api/business/viewership`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const json = await res.json();
  const rec = json.records?.[0];
  if (!rec) return null;
  return { season: json.season, week: rec.week, avg: rec.avg_viewers_million, sourceName: rec.source_name, sourceUrl: rec.source_url, publishedAt: rec.published_at };
}

export default async function Page() {
  const [{ games, upstream }, { rows }, pow, viewership] = await Promise.all([fetchScoreboard(), fetchStandings(), fetchPlayersOfWeek(), fetchViewership()]);
  const rowsAFC = rows.filter((r: any) => META_BY_ABBR[r.abbr]?.conference === "AFC");
  const rowsNFC = rows.filter((r: any) => META_BY_ABBR[r.abbr]?.conference === "NFC");

  return (
    <main>
      <section className="bg-gradient-to-br from-[var(--brand-1)] via-[var(--brand-2)] to-[var(--brand-3)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Referencia confiable de la NFL</h1>
            <p className="mt-3 text-slate-100">Marcadores (proxy ESPN), standings (ESPN Core) y Jugadores de la Semana (NFL.com).</p>
            <div className="mt-6 flex gap-3">
              <a href="#noticias" className="rounded-xl bg-[var(--brand-4)] px-4 py-2 font-semibold text-slate-900 hover:opacity-90">Noticias</a>
              <a href="#temporada" className="rounded-2xl bg-white/10 px-4 py-2 font-semibold hover:bg-white/20">Temporada</a>
            </div>
            <p className="mt-4 text-xs text-slate-200">Upstream scoreboard: {upstream || "—"}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-sm">Datos reales con caché controlada. Incluye standings por liga, por conferencia y por divisiones.</p>
            <p className="mt-2 text-xs">Fuentes: ESPN Scoreboard · ESPN Core · NFL.com · AP</p>
          </div>
        </div>
      </section>

      <section id="noticias" className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Resultados recientes</h2>
          <Link className="text-sm underline" href="https://www.espn.com/nfl/scoreboard" target="_blank">Scoreboard completo →</Link>
        </div>
        <div className="mt-4 grid md:grid-cols-3 gap-5">
          {games.slice(0, 6).map((g) => <GameCard key={g.id} g={g} />)}
          {games.length === 0 && <NewsCard title="Sin datos del marcador en este momento" subtitle="Intenta de nuevo en unos instantes. El proxy actualiza cada 60 segundos." />}
        </div>
      </section>

      <section id="jugadores" className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="text-xl font-bold">Jugadores de la Semana (oficial NFL)</h2>
          {pow.length > 0 ? (
            <ul className="mt-2 grid md:grid-cols-2 gap-3 text-sm">
              {pow.map((x, i) => (<li key={i} className="card"><strong>{x.conference} · {x.category}:</strong> {x.player} ({x.team}) {x.position ? `— ${x.position}` : ""}</li>))}
            </ul>
          ) : (<p className="text-sm text-slate-700">Aún sin datos locales; agrega archivos en <code>/data/players_of_week/</code> o activa scraping con <code>&url=</code>.</p>)}
          <p className="mt-2 text-xs text-slate-500">Fuente base: NFL.com</p>
        </div>
      </section>

      <section id="temporada" className="bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="text-xl font-bold">Standings (2025)</h2>
          <div className="mt-4 grid lg:grid-cols-2 gap-6">
            <StandingsTable title="Liga (general)" rows={rows} />
            <StandingsTable title="AFC (general)" rows={rowsAFC} />
          </div>
          <div className="mt-6 grid lg:grid-cols-2 gap-6">
            <StandingsTable title="NFC (general)" rows={rowsNFC} />
            {viewership && (<BusinessCard season={viewership.season} week={viewership.week} avgViewersM={viewership.avg} sourceName={viewership.sourceName} sourceUrl={viewership.sourceUrl} publishedAt={viewership.publishedAt} />)}
          </div>
          <h3 className="mt-8 font-semibold">Por divisiones</h3>
          <p className="text-sm text-slate-700">Ordenadas por PCT (ganados/total). Abreviaturas según ESPN.</p>
          <div className="mt-3"><DivisionGrid rows={rows} metaByAbbr={META_BY_ABBR as any} /></div>
        </div>
      </section>
    </main>
  );
}
