import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { EvalProvider } from "./eval/context";
import { Evaluator } from "./eval/Evaluator";
import { Layout } from "./eval/Layout";
import { Selector } from "./eval/Selector";

export function App() {
  return (
    <EvalProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/sandbox" replace />} />
            <Route path="sandbox" element={<Evaluator />} />
            <Route path="selector" element={<Selector />} />
            <Route path="*" element={<Navigate to="/sandbox" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </EvalProvider>
  );
}
