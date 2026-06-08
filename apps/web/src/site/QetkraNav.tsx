import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Soluciones", href: "#soluciones" },
  { label: "Sobre Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
  { label: "Trabajá con nosotros", href: "#trabaja" },
];

function Wordmark() {
  return (
    <a href="#inicio" className="select-none text-2xl font-bold tracking-tight">
      <span className="text-[var(--qk-blue)]">Q</span>
      <span className="text-[var(--qk-navy)]">etkra</span>
    </a>
  );
}

export function QetkraNav() {
  const [open, setOpen] = useState(false);
  // La sección "Trabajá con nosotros" es la pantalla actual (el formulario).
  const [active, setActive] = useState("Trabajá con nosotros");

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--qk-line)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Wordmark />

        <nav className="hidden h-full items-stretch gap-8 md:flex">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.label;
            return (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setActive(l.label)}
                className={[
                  "relative flex items-center text-sm font-medium transition",
                  isActive
                    ? "text-[var(--qk-navy)]"
                    : "text-[var(--qk-navy)]/70 hover:text-[var(--qk-blue)]",
                ].join(" ")}
              >
                {l.label}
                <span
                  className={[
                    "absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-[var(--qk-celeste)] transition-opacity",
                    isActive ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                />
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-9 items-center justify-center rounded-md text-[var(--qk-navy)] transition hover:bg-[var(--qk-blue-soft)] md:hidden"
          aria-label="Menú"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-[var(--qk-line)] px-6 py-3 md:hidden">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.label;
            return (
              <a
                key={l.label}
                href={l.href}
                onClick={() => {
                  setActive(l.label);
                  setOpen(false);
                }}
                className={[
                  "rounded-md border-l-[3px] px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "border-[var(--qk-celeste)] bg-[var(--qk-blue-soft)] text-[var(--qk-navy)]"
                    : "border-transparent text-[var(--qk-navy)]/80 hover:bg-[var(--qk-blue-soft)]",
                ].join(" ")}
              >
                {l.label}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
}
