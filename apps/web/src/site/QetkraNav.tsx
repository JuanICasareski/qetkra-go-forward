import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router";

const NAV_LINKS = [
  { label: "Soluciones", to: "/soluciones" },
  { label: "Sobre Nosotros", to: "/nosotros" },
  { label: "Contacto", to: "/contacto" },
];

function Wordmark() {
  return (
    <Link to="/" className="select-none text-2xl font-bold tracking-tight">
      <span className="text-[var(--qk-blue)]">Q</span>
      <span className="text-[var(--qk-navy)]">etkra</span>
    </Link>
  );
}

const desktopLink = ({ isActive }: { isActive: boolean }) =>
  [
    "relative flex items-center text-sm font-medium transition",
    isActive
      ? "text-[var(--qk-navy)]"
      : "text-[var(--qk-navy)]/70 hover:text-[var(--qk-blue)]",
  ].join(" ");

export function QetkraNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--qk-line)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Wordmark />

        <nav className="hidden h-full items-stretch gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.label} to={l.to} className={desktopLink}>
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={[
                      "absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-[var(--qk-celeste)] transition-opacity",
                      isActive ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <NavLink
            to="/trabaja"
            className={({ isActive }) =>
              [
                "rounded-lg px-4 py-2 text-sm font-semibold transition",
                isActive
                  ? "bg-[var(--qk-blue-dark)] text-white"
                  : "bg-[var(--qk-navy)] text-white hover:bg-[var(--qk-blue)]",
              ].join(" ")
            }
          >
            Trabajá con nosotros
          </NavLink>
        </div>

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
          {[...NAV_LINKS, { label: "Trabajá con nosotros", to: "/trabaja" }].map(
            (l) => (
              <NavLink
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    "rounded-md border-l-[3px] px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "border-[var(--qk-celeste)] bg-[var(--qk-blue-soft)] text-[var(--qk-navy)]"
                      : "border-transparent text-[var(--qk-navy)]/80 hover:bg-[var(--qk-blue-soft)]",
                  ].join(" ")
                }
              >
                {l.label}
              </NavLink>
            ),
          )}
        </nav>
      )}
    </header>
  );
}
