import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";

import { AuditTrail } from "@/components/AuditTrail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRIES } from "@/eval/metadata";
import { CERTAINTY_LABEL, CERTAINTY_STYLE, ResultCard } from "@/eval/ResultCard";
import { formatDate } from "@/products/meta";
import { ProductSummary } from "@/products/ProductSummary";
import { useStore } from "@/store/context";

const countryLabel = (code: string) =>
  COUNTRIES.find((c) => c.value === code)?.label ?? code.toUpperCase();

// Cola de revisión de clases (staff): trámites cuya certeza no fue
// "certain" y requieren validación humana antes de seguir.
export function ReviewQueue() {
  const { cases, products } = useStore();
  const pending = cases.filter((c) => c.status === "pending_review");

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">Revisión de clases</h2>
        <p className="text-sm text-muted-foreground">
          {pending.length} trámite(s) esperando validación de clase.
        </p>
      </div>

      {pending.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No hay clases pendientes de revisión.
          </CardContent>
        </Card>
      ) : (
        pending.map((c) => {
          const product = products.find((p) => p.id === c.productId);
          return (
            <Card key={c.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">
                      {product?.name ?? "Producto eliminado"}
                    </p>
                    <Badge className={CERTAINTY_STYLE[c.result.certainty]}>
                      {CERTAINTY_LABEL[c.result.certainty]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {countryLabel(c.country)} · clase propuesta:{" "}
                    <span className="font-medium">{c.finalClass}</span> ·{" "}
                    {formatDate(c.createdAt)}
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link to={`/review/${c.id}`}>Revisar</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

export function ReviewDetail() {
  const { id } = useParams();
  const { cases, products, resolveCase } = useStore();
  const navigate = useNavigate();

  const [correctedClass, setCorrectedClass] = useState("");
  const [note, setNote] = useState("");

  const item = cases.find((c) => c.id === id);
  if (!item || item.status !== "pending_review")
    return <Navigate to="/review" replace />;

  const product = products.find((p) => p.id === item.productId);

  const resolve = (approve: boolean) => {
    resolveCase(item.id, { approve, correctedClass, note });
    navigate("/review");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {product?.name ?? "Producto eliminado"} · {countryLabel(item.country)}
          </h2>
          <p className="text-sm text-muted-foreground">
            Trámite iniciado {formatDate(item.createdAt)} · reglas v
            {item.rulesVersion}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/review")}>
          Volver a la cola
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Propiedades del producto</CardTitle>
            </CardHeader>
            <CardContent>
              {product ? (
                <ProductSummary data={product.data} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  El producto fue eliminado; solo queda el snapshot del resultado.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historial</CardTitle>
            </CardHeader>
            <CardContent>
              <AuditTrail entity="case" entityId={item.id} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <ResultCard label="Salida del algoritmo" result={item.result} />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resolución</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Corregir clase (opcional — vacío conserva "{item.finalClass}")
                </Label>
                <Input
                  value={correctedClass}
                  onChange={(e) => setCorrectedClass(e.target.value)}
                  placeholder={item.finalClass}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Nota para el cliente (opcional)
                </Label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ej.: la clase se corrigió por la regla 8 del MDR…"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => resolve(false)}>
                  Observar
                </Button>
                <Button onClick={() => resolve(true)}>
                  {correctedClass.trim() !== ""
                    ? "Validar con clase corregida"
                    : "Confirmar clase"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
