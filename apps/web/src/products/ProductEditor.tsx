import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";

import { AuditTrail } from "@/components/AuditTrail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EvalProvider, useEval } from "@/eval/context";
import { TriBoolRow } from "@/eval/fields";
import { GENERAL_FLAGS, SPECIAL_FLAGS } from "@/eval/metadata";
import { ProductFields, TypeSpecificFields } from "@/eval/sections";
import {
  emptyProductData,
  missingFields,
  type FormState,
  type ProductData,
} from "@/eval/state";
import { useStore } from "@/store/context";
import type { Product } from "@/store/types";

// El form reusa el FormState del eval; los países no aplican al producto
// (se eligen recién al evaluar), van con un valor fijo que se descarta.
const toFormState = (data: ProductData): FormState => ({
  ...data,
  countries: { ar: true, eu: true, us: true },
});

const toProductData = (s: FormState): ProductData => {
  const { countries: _countries, ...data } = s;
  return data;
};

function EditorBody({ product }: { product: Product | undefined }) {
  const { state, set } = useEval();
  const { createProduct, updateProduct, setProductStatus } = useStore();
  const navigate = useNavigate();

  const [name, setName] = useState(product?.name ?? "");
  const [manufacturer, setManufacturer] = useState(product?.manufacturer ?? "");

  const missing = useMemo(() => missingFields(state), [state]);
  const canSave = name.trim() !== "" && manufacturer.trim() !== "";

  const save = (submit: boolean) => {
    const data = toProductData(state);
    let id: string;
    if (product) {
      updateProduct(product.id, { name, manufacturer, data });
      // Editar un producto ya resuelto lo devuelve a borrador.
      if (product.status !== "draft") setProductStatus(product.id, "draft");
      id = product.id;
    } else {
      id = createProduct(name, manufacturer, data).id;
    }
    if (submit) setProductStatus(id, "pending_validation");
    navigate("/products");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {product ? `Editar: ${product.name}` : "Nuevo producto"}
        </h2>
        <Badge variant={missing.length === 0 ? "secondary" : "outline"}>
          {missing.length === 0
            ? "Propiedades completas"
            : `${missing.length} propiedad(es) sin responder`}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identificación</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Nombre del producto
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej.: Marcapasos X100"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Fabricante / importador
            </Label>
            <Input
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              placeholder="Ej.: MedTech S.A."
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Propiedades base</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductFields />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Flags específicos del tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <TypeSpecificFields />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Flags especiales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {SPECIAL_FLAGS.map((f) => (
              <TriBoolRow
                key={f.key}
                label={f.label}
                checked={state.special[f.key]}
                onChange={(v) => set("special", { ...state.special, [f.key]: v })}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Flags generales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {GENERAL_FLAGS.map((f) => (
              <TriBoolRow
                key={f.key}
                label={f.label}
                checked={state.general[f.key]}
                onChange={(v) => set("general", { ...state.general, [f.key]: v })}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {product && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historial</CardTitle>
          </CardHeader>
          <CardContent>
            <AuditTrail entity="product" entityId={product.id} />
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-end gap-2">
        {missing.length > 0 && (
          <p className="mr-auto text-sm text-muted-foreground">
            Podés guardar con propiedades sin responder, pero no se podrá
            determinar la clase hasta completarlas.
          </p>
        )}
        <Button variant="outline" onClick={() => navigate("/products")}>
          Cancelar
        </Button>
        <Button variant="outline" disabled={!canSave} onClick={() => save(false)}>
          Guardar borrador
        </Button>
        <Button disabled={!canSave} onClick={() => save(true)}>
          Guardar y enviar a validación
        </Button>
      </div>
    </div>
  );
}

export function ProductEditor() {
  const { id } = useParams();
  const { products } = useStore();

  const product = id ? products.find((p) => p.id === id) : undefined;
  if (id && !product) return <Navigate to="/products" replace />;
  // Mientras el staff lo revisa, el cliente no puede editarlo.
  if (product && product.status === "pending_validation")
    return <Navigate to="/products" replace />;

  return (
    <EvalProvider
      key={product?.id ?? "new"}
      initial={toFormState(product?.data ?? emptyProductData)}
    >
      <EditorBody product={product} />
    </EvalProvider>
  );
}
