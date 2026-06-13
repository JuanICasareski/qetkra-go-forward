import { useMemo } from "react";

import evaluate from "rules/med/evaluate";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useEval } from "./context";
import { BoolRow, TriBoolRow } from "./fields";
import { COUNTRIES, GENERAL_FLAGS, SPECIAL_FLAGS } from "./metadata";
import { ResultCard } from "./ResultCard";
import { ProductFields, TypeSpecificFields } from "./sections";
import { buildFlags, fillDefaults, missingFields } from "./state";

export function Evaluator() {
  const { state, set, setState } = useEval();

  const missing = useMemo(() => missingFields(state), [state]);

  const results = useMemo(() => {
    const flags = buildFlags(state);
    if (flags === null) return [];
    return COUNTRIES.filter((c) => state.countries[c.value]).map((c) => ({
      ...c,
      result: evaluate(c.value, flags),
    }));
  }, [state]);

  return (
    <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-12">
      {/* Columna izquierda: info del producto + países, y flags type-specific */}
      <div className="space-y-4 lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProductFields />

            <Separator />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Países a evaluar
            </p>
            {COUNTRIES.map((c) => (
              <BoolRow
                key={c.value}
                label={c.label}
                checked={state.countries[c.value]}
                onChange={(v) =>
                  set("countries", { ...state.countries, [c.value]: v })
                }
              />
            ))}
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

      {/* Columna central: flags agrupados, ordenados por prioridad */}
      <div className="lg:col-span-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Características (flags)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Especiales
              </p>
              <div className="divide-y">
                {SPECIAL_FLAGS.map((f) => (
                  <TriBoolRow
                    key={f.key}
                    label={f.label}
                    checked={state.special[f.key]}
                    onChange={(v) =>
                      set("special", { ...state.special, [f.key]: v })
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Generales
              </p>
              <div className="divide-y">
                {GENERAL_FLAGS.map((f) => (
                  <TriBoolRow
                    key={f.key}
                    label={f.label}
                    checked={state.general[f.key]}
                    onChange={(v) =>
                      set("general", { ...state.general, [f.key]: v })
                    }
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Columna derecha: resultados por país */}
      <div className="space-y-4 lg:col-span-5">
        {missing.length > 0 ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
              <CardTitle className="text-base">Producto incompleto</CardTitle>
              <Badge variant="secondary">
                {missing.length} campo(s) sin responder
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                No se puede determinar la clase ni la necesidad de aprobación
                médica hasta responder todas las propiedades del producto.
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
                onClick={() => setState((prev) => fillDefaults(prev))}
              >
                Completar restantes con valores por defecto
              </Button>
            </CardContent>
          </Card>
        ) : results.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Seleccioná al menos un país para evaluar.
            </CardContent>
          </Card>
        ) : (
          results.map((r) => (
            <ResultCard key={r.value} label={r.label} result={r.result} />
          ))
        )}
      </div>
    </div>
  );
}
