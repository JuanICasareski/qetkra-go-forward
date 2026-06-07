import { NavLink, Outlet } from "react-router";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-1.5 text-sm font-medium transition",
    isActive
      ? "bg-foreground text-background"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  ].join(" ");

export function Layout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="flex items-center justify-between border-b bg-background px-6 py-3">
        <div>
          <h1 className="text-base font-semibold leading-none">
            Evaluador de productos médicos
          </h1>
          <p className="text-xs text-muted-foreground">AR · UE · US</p>
        </div>
        <nav className="flex gap-1">
          <NavLink to="/sandbox" className={linkClass}>
            Sandbox
          </NavLink>
          <NavLink to="/selector" className={linkClass}>
            Selector
          </NavLink>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
