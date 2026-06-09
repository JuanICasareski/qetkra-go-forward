import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

import { QetkraNav } from "./QetkraNav";
import { SiteFooter } from "./SiteFooter";

// Al cambiar de ruta, volvemos al inicio de la página.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ScrollToTop />
      <QetkraNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
