import { NextResponse } from "next/server";
export function GET() {
  const now = new Date().toISOString();
  const urls = ["/", "/#noticias", "/#temporada", "/#equipos", "/#jugadores", "/#reglas", "/#negocio", "/#recursos"];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url><loc>${u}</loc><lastmod>${now}</lastmod><priority>0.8</priority></url>`).join("")}
</urlset>`;
  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
