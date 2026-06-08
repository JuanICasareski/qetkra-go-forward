import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { EvalProvider } from "./eval/context";
import { Evaluator } from "./eval/Evaluator";
import { Layout } from "./eval/Layout";
import { NewProduct } from "./site/NewProduct";

export function App() {
  return (
    <EvalProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to="/new-product" replace />} />
          <Route path="new-product" element={<NewProduct />} />
          <Route element={<Layout />}>
            <Route path="sandbox" element={<Evaluator />} />
          </Route>
          <Route path="*" element={<Navigate to="/new-product" replace />} />
        </Routes>
      </BrowserRouter>
    </EvalProvider>
  );
}
