import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { EvalProvider } from "./eval/context";
import { Evaluator } from "./eval/Evaluator";
import { Layout } from "./eval/Layout";
import { Contacto } from "./site/Contacto";
import { Home } from "./site/Home";
import { NewProduct } from "./site/NewProduct";
import { SiteLayout } from "./site/SiteLayout";
import { SobreNosotros } from "./site/SobreNosotros";
import { Soluciones } from "./site/Soluciones";

export function App() {
  return (
    <EvalProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="soluciones" element={<Soluciones />} />
            <Route path="nosotros" element={<SobreNosotros />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="trabaja" element={<NewProduct />} />
          </Route>
          <Route element={<Layout />}>
            <Route path="sandbox" element={<Evaluator />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </EvalProvider>
  );
}
