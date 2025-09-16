export default function NewsCard(props: { title: string; subtitle?: string; href?: string; tag?: string }) {
  const { title, subtitle, href, tag } = props;
  return (
    <article className="card">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        {tag && <span className="tag">{tag}</span>}
      </div>
      {subtitle && <p className="mt-1 text-sm text-slate-700">{subtitle}</p>}
      {href && <a className="mt-2 inline-block text-sm underline text-slate-700" href={href} target="_blank" rel="noopener">Ver más →</a>}
    </article>
  );
}
