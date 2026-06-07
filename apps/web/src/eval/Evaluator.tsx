import { useMemo } from "react";

import evaluate from "rules/med/evaluate";
import type { EvaluationResult } from "rules/med";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useEval } from "./context";
import { BoolRow } from "./fields";
import { COUNTRIES, GENERAL_FLAGS, SPECIAL_FLAGS } from "./metadata";
import { ProductFields, TypeSpecificFields } from "./sections";
import { buildFlags } from "./state";

const CERTAINTY_STYLE: Record<EvaluationResult["certainty"], string> = {
  certain:
    "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  inferred:
    "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  undetermined:
    "border-transparent bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

const CERTAINTY_LABEL: Record<EvaluationResult["certainty"], string> = {
  certain: "Certeza alta",
  inferred: "Inferido",
  undetermined: "Indeterminado",
};

function ResultList(props: { title: string; items: string[] }) {
  if (props.items.length === 0) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {props.title}
      </p>
      <ul className="space-y-1">
        {props.items.map((it, i) => (
          <li key={i} className="text-sm leading-snug text-foreground/90">
            • {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultCard(props: { label: string; result: EvaluationResult }) {
  const { result } = props;
  const deviceClass = result.standards[0] ?? "—";
  const rules = result.standards.slice(1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-base">{props.label}</CardTitle>
        <Badge className={CERTAINTY_STYLE[result.certainty]}>
          {CERTAINTY_LABEL[result.certainty]}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg bg-muted px-3 py-2">
          <p className="text-xs text-muted-foreground">Clasificación</p>
          <p className="text-2xl font-bold tracking-tight">{deviceClass}</p>
        </div>
        <ResultList title="Reglas aplicadas" items={rules} />
        <Separator />
        <ResultList title="Autorización / vía" items={result.authorization} />
        <Separator />
        <ResultList title="Requisitos" items={result.requirements} />
      </CardContent>
    </Card>
  );
}

export function Evaluator() {
  const { state, set } = useEval();

  const results = useMemo(() => {
    const flags = buildFlags(state);
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
                  <BoolRow
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
                  <BoolRow
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
        {results.length === 0 ? (
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
