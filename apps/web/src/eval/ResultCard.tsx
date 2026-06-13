import type { EvaluationResult } from "rules/med";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const CERTAINTY_STYLE: Record<EvaluationResult["certainty"], string> = {
  certain:
    "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  inferred:
    "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  undetermined:
    "border-transparent bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

export const CERTAINTY_LABEL: Record<EvaluationResult["certainty"], string> = {
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

export function ResultCard(props: { label: string; result: EvaluationResult }) {
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
