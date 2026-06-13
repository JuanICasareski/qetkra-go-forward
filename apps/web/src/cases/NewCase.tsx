import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import evaluate from "rules/med/evaluate";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BoolRow } from "@/eval/fields";
import { COUNTRIES, type CountryCode } from "@/eval/metadata";
import { ResultCard } from "@/eval/ResultCard";
import { buildFlags, missingFields } from "@/eval/state";
import { STATUS_LABEL, STATUS_STYLE } from "@/products/meta";
import { useStore } from "@/store/context";

export function NewCase() {
  const { products, createCase } = useStore();
  const navigate = useNavigate();

  const [productId, setProductId] = useState<string>("");
  const [countries, setCountries] = useState<Record<CountryCode, boolean>>({
    ar: true,
    eu: false,
    us: false,
  });

  const product = products.find((p) => p.id === productId);
  const missing = product ? missingFields(product.data) : [];
  const flags = product ? buildFlags(product.data) : null;
  const selected = COUNTRIES.filter((c) => countries[c.value]);

  // Previsualización: el cliente ve clase y certeza antes de iniciar.
  const preview = useMemo(() => {
    if (flags === null) return [];
    return selected.map((c) => ({ ...c, result: evaluate(c.value, flags) }));
  }, [flags, countries]); // eslint-disable-line react-hooks/exhaustive-deps

  const create = () => {
    if (!product || flags === null) return;
    for (const c of selected) createCase(product.id, c.value, evaluate(c.value, flags));
    navigate("/cases");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4">
      <h2 className="text-lg font-semibold">Nuevo trámite</h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Producto y países</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Producto a certificar
              </Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Elegí un producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {product && (
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Propiedades:</span>
                  <Badge className={STATUS_STYLE[product.status]}>
                    {STATUS_LABEL[product.status]}
                  </Badge>
                </div>
                {product.status !== "validated" && (
                  <p className="text-xs text-muted-foreground">
                    Las propiedades aún no fueron validadas por el staff; la
                    clasificación puede cambiar tras esa validación.
                  </p>
                )}
              </div>
            )}

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Países a certificar
              </p>
              {COUNTRIES.map((c) => (
                <BoolRow
                  key={c.value}
                  label={c.label}
                  checked={countries[c.value]}
                  onChange={(v) => setCountries({ ...countries, [c.value]: v })}
                />
              ))}
            </div>

            <Button
              className="w-full"
              disabled={!product || flags === null || selected.length === 0}
              onClick={create}
            >
              Iniciar trámite{selected.length > 1 ? "s" : ""} (
              {selected.length})
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {!product ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Elegí un producto para previsualizar su clasificación.
              </CardContent>
            </Card>
          ) : missing.length > 0 ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
                <CardTitle className="text-base">Producto incompleto</CardTitle>
                <Badge variant="secondary">
                  {missing.length} campo(s) sin responder
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  No se puede determinar la clase ni iniciar el trámite hasta
                  responder todas las propiedades del producto.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {missing.map((label) => (
                    <Badge key={label} variant="outline">
                      {label}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/products/${product.id}/edit`)}
                >
                  Completar propiedades
                </Button>
              </CardContent>
            </Card>
          ) : selected.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Seleccioná al menos un país.
              </CardContent>
            </Card>
          ) : (
            preview.map((r) => (
              <ResultCard key={r.value} label={r.label} result={r.result} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
