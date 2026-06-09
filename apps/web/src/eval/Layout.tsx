import { NavLink, Outlet } from "react-router";

import { QetkraNav } from "../site/QetkraNav";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-1.5 text-sm font-medium transition",
    isActive
      ? "bg-[var(--qk-navy)] text-white"
      : "text-muted-foreground hover:bg-[var(--qk-blue-soft)] hover:text-[var(--qk-navy)]",
  ].join(" ");

export function Layout() {
  return (
    <div className="min-h-screen bg-muted/20">
      <QetkraNav />
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <div>
          <h1 className="text-base font-semibold leading-none text-[var(--qk-navy)]">
            Sandbox · Evaluador de productos médicos
          </h1>
          <p className="text-xs text-muted-foreground">AR · UE · US</p>
        </div>
        <nav className="flex gap-1">
          <NavLink to="/sandbox" className={linkClass}>
            Sandbox
          </NavLink>
          <NavLink to="/trabaja" className={linkClass}>
            Nuevo producto
          </NavLink>
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
