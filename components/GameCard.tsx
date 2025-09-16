import type { GameCard } from "@/lib/espn";
export default function GameCard({ g }: { g: GameCard }) {
  const statusLabel = g.completed ? "Final" : (g.state === "in" ? "En juego" : "Programado");
  const sub = g.completed ? `${g.away.abbr} ${g.away.score} — ${g.home.abbr} ${g.home.score}` : g.description || new Date(g.date).toLocaleString();
  return (
    <article className="card">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{g.shortName}</h3>
        <span className="tag">{statusLabel}</span>
      </div>
      <p className="mt-1 text-sm text-slate-700">{sub}</p>
      {g.boxscoreUrl && <a className="mt-2 inline-block text-sm underline" href={g.boxscoreUrl} target="_blank" rel="noopener">Boxscore ESPN →</a>}
    </article>
  );
}
