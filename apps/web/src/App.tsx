import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { CaseList } from "./cases/CaseList";
import { NewCase } from "./cases/NewCase";
import { ReviewDetail, ReviewQueue } from "./cases/ReviewQueue";
import { EvalProvider } from "./eval/context";
import { Evaluator } from "./eval/Evaluator";
import { Layout } from "./eval/Layout";
import { Selector } from "./eval/Selector";
import { ProductEditor } from "./products/ProductEditor";
import { ProductList } from "./products/ProductList";
import { ValidationQueue, ValidationReview } from "./products/ValidationQueue";
import { StoreProvider } from "./store/context";

export function App() {
  return (
    <StoreProvider>
      <EvalProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/products" replace />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<ProductEditor />} />
              <Route path="products/:id/edit" element={<ProductEditor />} />
              <Route path="cases" element={<CaseList />} />
              <Route path="cases/new" element={<NewCase />} />
              <Route path="validation" element={<ValidationQueue />} />
              <Route path="validation/:id" element={<ValidationReview />} />
              <Route path="review" element={<ReviewQueue />} />
              <Route path="review/:id" element={<ReviewDetail />} />
              <Route path="sandbox" element={<Evaluator />} />
              <Route path="selector" element={<Selector />} />
              <Route path="*" element={<Navigate to="/products" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </EvalProvider>
    </StoreProvider>
  );
}
