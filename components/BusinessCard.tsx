export default function BusinessCard(props: { season: number; week: number; avgViewersM: number; sourceName: string; sourceUrl: string; publishedAt: string; }) {
  const { season, week, avgViewersM, sourceName, sourceUrl, publishedAt } = props;
  return (
    <article className="card">
      <h3 className="font-semibold">Audiencias {season}</h3>
      <p className="mt-1 text-sm text-slate-700">Semana {week}: <strong>{avgViewersM.toFixed(1)} M</strong> espectadores por juego (promedio).</p>
      <p className="mt-1 text-xs text-slate-500">Publicación: {new Date(publishedAt).toLocaleDateString()}</p>
      <a className="mt-2 inline-block text-sm underline" href={sourceUrl} target="_blank" rel="noopener">Fuente: {sourceName} →</a>
    </article>
  );
}
