import { useMemo, useState } from "react";

import evaluate from "rules/med/evaluate";
import type { EvaluationResult } from "rules/med";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  BODY_AREAS,
  COMBINATION_PMOA,
  COMBINATION_SUBSTANCE,
  CONTACT_DURATIONS,
  COUNTRIES,
  DEVICE_TYPES,
  GENERAL_FLAGS,
  INVASIVENESS,
  IVD_INDIVIDUAL,
  IVD_RISK3,
  SAMD_SEVERITY,
  SAMD_SIGNIFICANCE,
  SPECIAL_FLAGS,
  type Option,
} from "./metadata";
import { buildFlags, initialState, type FormState } from "./state";

function EnumField<T extends string>(props: {
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {props.label}
      </Label>
      <Select value={props.value} onValueChange={(v) => props.onChange(v as T)}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {props.options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function BoolRow(props: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1.5">
      <span className="text-sm leading-snug">{props.label}</span>
      <Switch checked={props.checked} onCheckedChange={props.onChange} />
    </label>
  );
}

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
  const [state, setState] = useState<FormState>(initialState);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((prev) => ({ ...prev, [key]: value }));

  const results = useMemo(() => {
    const flags = buildFlags(state);
    return COUNTRIES.filter((c) => state.countries[c.value]).map((c) => ({
      ...c,
      result: evaluate(c.value, flags),
    }));
  }, [state]);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background px-6 py-4">
        <h1 className="text-lg font-semibold">Evaluador de productos médicos</h1>
        <p className="text-sm text-muted-foreground">
          Clasificación y vía regulatoria para AR (ANMAT), UE (MDR) y US (FDA)
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-12">
        {/* Columna izquierda: info del producto + países, y flags type-specific */}
        <div className="space-y-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <EnumField
                label="Tipo de dispositivo"
                value={state.device_type}
                options={DEVICE_TYPES}
                onChange={(v) => set("device_type", v)}
              />
              <EnumField
                label="Invasividad"
                value={state.invasiveness}
                options={INVASIVENESS}
                onChange={(v) => set("invasiveness", v)}
              />
              <EnumField
                label="Zona del cuerpo"
                value={state.contact_nature}
                options={BODY_AREAS}
                onChange={(v) => set("contact_nature", v)}
              />
              <EnumField
                label="Duración de contacto"
                value={state.contact_duration}
                options={CONTACT_DURATIONS}
                onChange={(v) => set("contact_duration", v)}
              />
              <BoolRow
                label="Dispositivo activo"
                checked={state.is_active}
                onChange={(v) => set("is_active", v)}
              />

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
            <CardContent className="space-y-3">
              {state.device_type === "samd" ? (
                <>
                  <EnumField
                    label="Significancia (decisión clínica)"
                    value={state.samd.significance}
                    options={SAMD_SIGNIFICANCE}
                    onChange={(v) => set("samd", { ...state.samd, significance: v })}
                  />
                  <EnumField
                    label="Gravedad de la condición"
                    value={state.samd.condition_severity}
                    options={SAMD_SEVERITY}
                    onChange={(v) =>
                      set("samd", { ...state.samd, condition_severity: v })
                    }
                  />
                  <BoolRow
                    label="Habilitado por IA/ML"
                    checked={state.samd.is_ai_ml_enabled}
                    onChange={(v) =>
                      set("samd", { ...state.samd, is_ai_ml_enabled: v })
                    }
                  />
                  <BoolRow
                    label="Controla otro dispositivo"
                    checked={state.samd.controls_other_device}
                    onChange={(v) =>
                      set("samd", { ...state.samd, controls_other_device: v })
                    }
                  />
                </>
              ) : state.device_type === "combination" ? (
                <>
                  <EnumField
                    label="Modo de acción primario"
                    value={state.combination.primary_mode_of_action}
                    options={COMBINATION_PMOA}
                    onChange={(v) =>
                      set("combination", {
                        ...state.combination,
                        primary_mode_of_action: v,
                      })
                    }
                  />
                  <EnumField
                    label="Acción de la sustancia"
                    value={state.combination.substance_action}
                    options={COMBINATION_SUBSTANCE}
                    onChange={(v) =>
                      set("combination", {
                        ...state.combination,
                        substance_action: v,
                      })
                    }
                  />
                  <BoolRow
                    label="Producto integral"
                    checked={state.combination.is_integral}
                    onChange={(v) =>
                      set("combination", { ...state.combination, is_integral: v })
                    }
                  />
                </>
              ) : state.device_type === "ivd" ? (
                <>
                  <EnumField
                    label="Riesgo de salud pública"
                    value={state.ivd.public_health_risk}
                    options={IVD_RISK3}
                    onChange={(v) =>
                      set("ivd", { ...state.ivd, public_health_risk: v })
                    }
                  />
                  <EnumField
                    label="Riesgo individual"
                    value={state.ivd.individual_risk}
                    options={IVD_INDIVIDUAL}
                    onChange={(v) =>
                      set("ivd", { ...state.ivd, individual_risk: v })
                    }
                  />
                  <BoolRow
                    label="Detecta agente transmisible"
                    checked={state.ivd.detects_transmissible_agent}
                    onChange={(v) =>
                      set("ivd", { ...state.ivd, detects_transmissible_agent: v })
                    }
                  />
                  <BoolRow
                    label="Autodiagnóstico"
                    checked={state.ivd.is_self_testing}
                    onChange={(v) =>
                      set("ivd", { ...state.ivd, is_self_testing: v })
                    }
                  />
                  <BoolRow
                    label="Point-of-care"
                    checked={state.ivd.is_near_patient_testing}
                    onChange={(v) =>
                      set("ivd", { ...state.ivd, is_near_patient_testing: v })
                    }
                  />
                  <BoolRow
                    label="Control / calibrador"
                    checked={state.ivd.is_control_or_calibrator}
                    onChange={(v) =>
                      set("ivd", { ...state.ivd, is_control_or_calibrator: v })
                    }
                  />
                  <BoolRow
                    label="Tamizaje / estadificación"
                    checked={state.ivd.is_screening_or_staging}
                    onChange={(v) =>
                      set("ivd", { ...state.ivd, is_screening_or_staging: v })
                    }
                  />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  N/A — este tipo de dispositivo no tiene flags específicos.
                </p>
              )}
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
    </div>
  );
}
