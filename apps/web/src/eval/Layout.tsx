import { NavLink, Outlet } from "react-router";

import { NotificationsBell } from "@/components/NotificationsBell";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useStore } from "@/store/context";
import type { Role } from "@/store/types";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-md px-3 py-1.5 text-sm font-medium transition",
    isActive
      ? "bg-foreground text-background"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  ].join(" ");

export function Layout() {
  const { role, setRole, products, cases } = useStore();

  const pendingProducts = products.filter(
    (p) => p.status === "pending_validation",
  ).length;
  const pendingCases = cases.filter(
    (c) => c.status === "pending_review",
  ).length;

  const withCount = (label: string, count: number) =>
    count > 0 ? `${label} (${count})` : label;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="flex items-center justify-between border-b bg-background px-6 py-3">
        <div>
          <h1 className="text-base font-semibold leading-none">
            Aprobaciones médicas
          </h1>
          <p className="text-xs text-muted-foreground">Qetkra · AR · UE · US</p>
        </div>
        <nav className="flex gap-1">
          {role === "client" && (
            <>
              <NavLink to="/products" className={linkClass}>
                Mis productos
              </NavLink>
              <NavLink to="/cases" className={linkClass}>
                Trámites
              </NavLink>
            </>
          )}
          {role === "staff" && (
            <>
              <NavLink to="/validation" className={linkClass}>
                {withCount("Validaciones", pendingProducts)}
              </NavLink>
              <NavLink to="/review" className={linkClass}>
                {withCount("Clases", pendingCases)}
              </NavLink>
            </>
          )}
          <NavLink to="/sandbox" className={linkClass}>
            Sandbox
          </NavLink>
          <NavLink to="/selector" className={linkClass}>
            Selector
          </NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <NotificationsBell />
          {/* Rol simulado: define qué vistas y acciones están disponibles. */}
          <ToggleGroup
            type="single"
            size="sm"
            variant="outline"
            value={role}
            onValueChange={(v) => {
              if (v !== "") setRole(v as Role);
            }}
          >
            <ToggleGroupItem value="client">Cliente</ToggleGroupItem>
            <ToggleGroupItem value="staff">Staff Qetkra</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
