import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Portal NFL — Datos verificados",
  description: "Portal informativo de la NFL con noticias, calendario, resultados, clasificaciones, reglas y negocio.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <a className="flex items-center gap-3" href="/">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-4)] text-white font-bold">NFL</span>
              <span className="text-lg font-semibold tracking-tight">Portal Informativo</span>
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="/#noticias">Noticias</a>
              <a href="/#temporada">Temporada</a>
              <a href="/#equipos">Equipos</a>
              <a href="/#jugadores">Jugadores</a>
              <a href="/#reglas">Reglas</a>
              <a href="/#negocio">Negocio</a>
              <a href="/#recursos">Recursos</a>
            </nav>
            <div className="text-xs text-slate-600">Beta · datos cacheados 60s</div>
          </div>
        </header>
        {children}
        <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <p>© 2025 Portal NFL (demo). No afiliado a la NFL.</p>
            <p>Fuentes: NFL.com · ESPN · PFR · NFL Operations · AP/Reuters.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
