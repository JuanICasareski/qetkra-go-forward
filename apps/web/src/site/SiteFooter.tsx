import { Link } from "react-router";

import oaaLogo from "@/assets/qetkra/oaa.png";
import sealsEnacom from "@/assets/qetkra/seals-enacom.png";
import sealsIso from "@/assets/qetkra/seals-iso.png";

type Col = { title: string; links: { label: string; to: string }[] };

const COLUMNS: Col[] = [
  {
    title: "Sobre Qetkra",
    links: [
      { label: "Sobre Nosotros", to: "/nosotros" },
      { label: "Empleo", to: "/trabaja" },
      { label: "Contacto", to: "/contacto" },
    ],
  },
  {
    title: "Soluciones",
    links: [
      { label: "Sistemas de gestión", to: "/soluciones" },
      { label: "Comercio Exterior", to: "/soluciones" },
      { label: "Productos", to: "/soluciones" },
    ],
  },
  {
    title: "Legales",
    links: [
      { label: "Condiciones de uso", to: "/contacto" },
      { label: "Cookies", to: "/contacto" },
      { label: "Privacidad", to: "/contacto" },
    ],
  },
];

const LANGS = ["Español", "English", "中文"];

export function SiteFooter() {
  return (
    <footer className="bg-[#2b2b2b] text-zinc-300">
      {/* Tira de sellos de acreditación y certificación */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-6 py-7">
          <img src={oaaLogo} alt="OAA" className="h-12 w-auto" />
          <img
            src={sealsEnacom}
            alt="ENACOM · CNC · URSEC"
            className="h-7 w-auto opacity-90"
          />
          <img
            src={sealsIso}
            alt="IEC · CE · INTI · ISO · Lealtad Comercial"
            className="h-9 w-auto opacity-90"
          />
        </div>
      </div>

      {/* Columnas de navegación */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-sm font-bold text-white">{col.title}</h3>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-zinc-400 transition hover:text-[var(--qk-celeste)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Idiomas + mapa del sitio */}
        <div>
          <ul className="space-y-2.5">
            {LANGS.map((lang) => (
              <li key={lang}>
                <button
                  type="button"
                  className="text-sm text-zinc-400 transition hover:text-[var(--qk-celeste)]"
                >
                  {lang}
                </button>
              </li>
            ))}
          </ul>
          <h3 className="mt-5 text-sm font-bold text-white">Mapa del sitio</h3>
        </div>
      </div>

      {/* Barra de contacto inferior */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-5 text-center text-xs text-zinc-400">
          +54 11 5239 5077 · info@qetkra.com · Edificio SAFICO, Av. Corrientes
          456, Piso 22. Ciudad de Buenos Aires, Argentina, C1043AAR
        </div>
      </div>
    </footer>
  );
}
