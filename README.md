# Portal NFL — Next.js + Tailwind + API (ESPN Core/Scoreboard) + Conferencias/Divisiones + Negocio

## Arranque local
```bash
npm install
npm run dev
# http://localhost:3000
```

## Despliegue (link público inmediato)
**Vercel (recomendado):**
1) https://vercel.com/new → **Import Project → Upload** y sube este ZIP.
2) Nombre: `portal-nfl` (o el que prefieras).
3) (Opcional) `NEXT_PUBLIC_SITE_URL` con tu dominio; si no, Vercel usa `VERCEL_URL`.
4) **Deploy**. Obtendrás un link tipo `https://portal-nfl.vercel.app`.

**Docker (alternativa):**
```bash
docker build -t portal-nfl .
docker run -p 3000:3000 -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 portal-nfl
```

## Qué está incluido
- `/api/scoreboard` → Proxy a ESPN Scoreboard (cache 60s).
- `/api/standings` → ESPN Core standings (cache 10 min).
- `/api/players-of-week` → Datos locales (Week 1 2025) + opción `&url=` para parsear una nota de NFL.com.
- `/api/business/viewership` → JSON local con audiencia Week 1 2025 (22.3M) y fuente AP.
- Home muestra **Liga**, **AFC**, **NFC**, y **8 divisiones** con tablas ordenadas por PCT. Además, **tarjeta de Audiencias**.
- SEO: `robots.txt` y `sitemap.xml`.
- Seguridad: headers (X-Frame-Options, nosniff, etc.).

## Notas
- Este proyecto es educativo. Respeta Términos y atribuye las fuentes al mostrar datos.
