type Row = { team: string; abbr: string; wins: number; losses: number; ties: number; pct: number; streak?: string };
type MetaByAbbr = Record<string, { conference: "AFC"|"NFC"; division: "East"|"North"|"South"|"West" } | undefined>;
function MiniTable({ title, rows }: { title: string; rows: Row[] }) {
  const sorted = [...rows].sort((a, b) => b.pct - a.pct || (b.wins - a.wins));
  return (
    <div className="card">
      <h4 className="font-semibold">{title}</h4>
      <table className="mt-2 w-full text-sm">
        <thead><tr className="text-left text-slate-500"><th>Equipo</th><th>W</th><th>L</th><th>PCT</th></tr></thead>
        <tbody>{sorted.map((r) => (<tr key={r.abbr}><td>{r.team}</td><td>{r.wins}</td><td>{r.losses}</td><td>{r.pct.toFixed(3)}</td></tr>))}</tbody>
      </table>
    </div>
  );
}
export default function DivisionGrid({ rows, metaByAbbr }: { rows: Row[]; metaByAbbr: MetaByAbbr }) {
  const divisions = [
    { key: "AFC East", filter: (r: Row) => metaByAbbr[r.abbr]?.conference === "AFC" && metaByAbbr[r.abbr]?.division === "East" },
    { key: "AFC North", filter: (r: Row) => metaByAbbr[r.abbr]?.conference === "AFC" && metaByAbbr[r.abbr]?.division === "North" },
    { key: "AFC South", filter: (r: Row) => metaByAbbr[r.abbr]?.conference === "AFC" && metaByAbbr[r.abbr]?.division === "South" },
    { key: "AFC West",  filter: (r: Row) => metaByAbbr[r.abbr]?.conference === "AFC" && metaByAbbr[r.abbr]?.division === "West" },
    { key: "NFC East", filter: (r: Row) => metaByAbbr[r.abbr]?.conference === "NFC" && metaByAbbr[r.abbr]?.division === "East" },
    { key: "NFC North", filter: (r: Row) => metaByAbbr[r.abbr]?.conference === "NFC" && metaByAbbr[r.abbr]?.division === "North" },
    { key: "NFC South", filter: (r: Row) => metaByAbbr[r.abbr]?.conference === "NFC" && metaByAbbr[r.abbr]?.division === "South" },
    { key: "NFC West",  filter: (r: Row) => metaByAbbr[r.abbr]?.conference === "NFC" && metaByAbbr[r.abbr]?.division === "West" },
  ];
  return <div className="grid lg:grid-cols-2 gap-5">{divisions.map(d => <MiniTable key={d.key} title={d.key} rows={rows.filter(d.filter)} />)}</div>;
}
