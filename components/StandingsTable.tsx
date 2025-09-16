type Row = { team: string; abbr: string; wins: number; losses: number; ties: number; pct: number; streak?: string };
export default function StandingsTable({ rows, title }: { rows: Row[]; title: string }) {
  const sorted = [...rows].sort((a, b) => b.pct - a.pct || (b.wins - a.wins));
  return (
    <div className="card">
      <h3 className="font-semibold">{title}</h3>
      <table className="mt-2 w-full text-sm">
        <thead><tr className="text-left text-slate-500"><th>Equipo</th><th>W</th><th>L</th><th>T</th><th>PCT</th><th className="text-right">Racha</th></tr></thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.abbr}>
              <td>{r.team}</td><td>{r.wins}</td><td>{r.losses}</td><td>{r.ties}</td><td>{r.pct.toFixed(3)}</td><td className="text-right">{r.streak || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-slate-500">Fuente: ESPN Core API (cache 10 min)</p>
    </div>
  );
}
