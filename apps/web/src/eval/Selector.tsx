import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useEval } from "./context";
import { TriBoolRow } from "./fields";
import {
  BODY_AREAS,
  CONTACT_DURATIONS,
  DEVICE_TYPES,
  GENERAL_FLAGS,
  INVASIVENESS,
  SPECIAL_FLAGS,
} from "./metadata";
import { ProductFields, TypeSpecificFields } from "./sections";
import { initialState, missingFields } from "./state";

const labelOf = <T extends string>(
  options: readonly { value: T; label: string }[],
  value: T | undefined,
) =>
  value === undefined
    ? "Sin responder"
    : (options.find((o) => o.value === value)?.label ?? value);

export function Selector() {
  const { state, set, setState } = useEval();

  const activeFlags = useMemo(() => {
    const s = SPECIAL_FLAGS.filter((f) => state.special[f.key] === true).map(
      (f) => f.label,
    );
    const g = GENERAL_FLAGS.filter((f) => state.general[f.key] === true).map(
      (f) => f.label,
    );
    return [...s, ...g];
  }, [state.special, state.general]);

  const missing = useMemo(() => missingFields(state), [state]);

  const setAll = (value: boolean | undefined) =>
    setState((prev) => ({
      ...prev,
      special: Object.fromEntries(
        SPECIAL_FLAGS.map((f) => [f.key, value]),
      ) as typeof prev.special,
      general: Object.fromEntries(
        GENERAL_FLAGS.map((f) => [f.key, value]),
      ) as typeof prev.general,
    }));

  return (
    <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {activeFlags.length} flag(s) en sí · {missing.length} campo(s) sin
            responder
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setAll(true)}>
              Todas en sí
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAll(false)}>
              Todas en no
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAll(undefined)}
            >
              Limpiar flags
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Producto</CardTitle>
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
                  hint={f.hint}
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
                  hint={f.hint}
                  checked={state.general[f.key]}
                  onChange={(v) => set("general", { ...state.general, [f.key]: v })}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de la selección actual */}
      <div className="lg:col-span-1">
        <Card className="lg:sticky lg:top-4">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-base">Selección actual</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setState(initialState)}>
              Reset
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg bg-muted px-3 py-2">
              <p className="text-xs text-muted-foreground">Completitud</p>
              <p className="font-medium">
                {missing.length === 0
                  ? "Producto completo: se puede determinar la clase."
                  : `Faltan ${missing.length} campo(s): no se puede determinar la clase.`}
              </p>
            </div>

            <dl className="space-y-1">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Tipo</dt>
                <dd className="text-right font-medium">
                  {labelOf(DEVICE_TYPES, state.device_type)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Invasividad</dt>
                <dd className="text-right font-medium">
                  {labelOf(INVASIVENESS, state.invasiveness)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Zona</dt>
                <dd className="text-right font-medium">
                  {labelOf(BODY_AREAS, state.contact_nature)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Duración</dt>
                <dd className="text-right font-medium">
                  {labelOf(CONTACT_DURATIONS, state.contact_duration)}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Activo</dt>
                <dd className="text-right font-medium">
                  {state.is_active === undefined
                    ? "Sin responder"
                    : state.is_active
                      ? "Sí"
                      : "No"}
                </dd>
              </div>
            </dl>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Flags activas ({activeFlags.length})
              </p>
              {activeFlags.length === 0 ? (
                <p className="text-muted-foreground">Ninguna flag en sí.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {activeFlags.map((label) => (
                    <Badge key={label} variant="secondary">
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
