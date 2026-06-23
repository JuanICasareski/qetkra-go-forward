import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HintIcon } from "@/eval/fields";
import {
  BODY_AREAS,
  COMBINATION_PMOA,
  COMBINATION_SUBSTANCE,
  CONTACT_DURATIONS,
  DEVICE_TYPES,
  FIELD_HINTS,
  GENERAL_FLAGS,
  INVASIVENESS,
  IVD_INDIVIDUAL,
  IVD_RISK3,
  SAMD_SEVERITY,
  SAMD_SIGNIFICANCE,
  SPECIAL_FLAGS,
} from "@/eval/metadata";
import type { ProductData } from "@/eval/state";

const enumLabel = <T extends string>(
  options: readonly { value: T; label: string }[],
  value: T | undefined,
) =>
  value === undefined
    ? "Sin responder"
    : (options.find((o) => o.value === value)?.label ?? value);

const yn = (v: boolean | undefined) =>
  v === undefined ? "Sin responder" : v ? "Sí" : "No";

function Row(props: { label: string; value: string; hint?: string }) {
  const unanswered = props.value === "Sin responder";
  return (
    <div className="flex justify-between gap-2">
      <dt className="flex items-center gap-1.5 text-muted-foreground">
        {props.label}
        {props.hint ? <HintIcon hint={props.hint} label={props.label} /> : null}
      </dt>
      <dd
        className={[
          "text-right font-medium",
          unanswered ? "text-muted-foreground/70 italic" : "",
        ].join(" ")}
      >
        {props.value}
      </dd>
    </div>
  );
}

// Flags de una sección agrupadas por respuesta: las que están en sí son
// las regulatoriamente relevantes; las sin responder son las que bloquean
// la clasificación.
function FlagGroup(props: {
  title: string;
  flags: { label: string; value: boolean | undefined; hint: string }[];
}) {
  const yes = props.flags.filter((f) => f.value === true);
  const unanswered = props.flags.filter((f) => f.value === undefined);
  const noCount = props.flags.length - yes.length - unanswered.length;

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {props.title}
      </p>
      {yes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {yes.map((f) => (
            <Badge key={f.label} variant="secondary" className="gap-1">
              {f.label}
              <HintIcon hint={f.hint} label={f.label} />
            </Badge>
          ))}
        </div>
      )}
      {unanswered.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {unanswered.map((f) => (
            <Badge
              key={f.label}
              variant="outline"
              className="gap-1 text-muted-foreground"
            >
              {f.label}: sin responder
              <HintIcon hint={f.hint} label={f.label} />
            </Badge>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        {noCount} flag(s) en no
        {yes.length === 0 ? " · ninguna en sí" : ""}
      </p>
    </div>
  );
}

export function ProductSummary({ data }: { data: ProductData }) {
  return (
    <div className="space-y-4 text-sm">
      <dl className="space-y-1">
        <Row
          label="Tipo"
          hint={FIELD_HINTS.base.device_type}
          value={enumLabel(DEVICE_TYPES, data.device_type)}
        />
        <Row
          label="Invasividad"
          hint={FIELD_HINTS.base.invasiveness}
          value={enumLabel(INVASIVENESS, data.invasiveness)}
        />
        <Row
          label="Zona"
          hint={FIELD_HINTS.base.contact_nature}
          value={enumLabel(BODY_AREAS, data.contact_nature)}
        />
        <Row
          label="Duración"
          hint={FIELD_HINTS.base.contact_duration}
          value={enumLabel(CONTACT_DURATIONS, data.contact_duration)}
        />
        <Row label="Activo" hint={FIELD_HINTS.base.is_active} value={yn(data.is_active)} />
      </dl>

      {data.device_type === "samd" && (
        <dl className="space-y-1">
          <Row
            label="Significancia"
            hint={FIELD_HINTS.samd.significance}
            value={enumLabel(SAMD_SIGNIFICANCE, data.samd.significance)}
          />
          <Row
            label="Gravedad de la condición"
            hint={FIELD_HINTS.samd.condition_severity}
            value={enumLabel(SAMD_SEVERITY, data.samd.condition_severity)}
          />
          <Row
            label="Habilitado por IA/ML"
            hint={FIELD_HINTS.samd.is_ai_ml_enabled}
            value={yn(data.samd.is_ai_ml_enabled)}
          />
          <Row
            label="Controla otro dispositivo"
            hint={FIELD_HINTS.samd.controls_other_device}
            value={yn(data.samd.controls_other_device)}
          />
        </dl>
      )}

      {data.device_type === "ivd" && (
        <dl className="space-y-1">
          <Row
            label="Riesgo de salud pública"
            hint={FIELD_HINTS.ivd.public_health_risk}
            value={enumLabel(IVD_RISK3, data.ivd.public_health_risk)}
          />
          <Row
            label="Riesgo individual"
            hint={FIELD_HINTS.ivd.individual_risk}
            value={enumLabel(IVD_INDIVIDUAL, data.ivd.individual_risk)}
          />
          <Row
            label="Detecta agente transmisible"
            hint={FIELD_HINTS.ivd.detects_transmissible_agent}
            value={yn(data.ivd.detects_transmissible_agent)}
          />
          <Row
            label="Autodiagnóstico"
            hint={FIELD_HINTS.ivd.is_self_testing}
            value={yn(data.ivd.is_self_testing)}
          />
          <Row
            label="Point-of-care"
            hint={FIELD_HINTS.ivd.is_near_patient_testing}
            value={yn(data.ivd.is_near_patient_testing)}
          />
          <Row
            label="Control / calibrador"
            hint={FIELD_HINTS.ivd.is_control_or_calibrator}
            value={yn(data.ivd.is_control_or_calibrator)}
          />
          <Row
            label="Tamizaje / estadificación"
            hint={FIELD_HINTS.ivd.is_screening_or_staging}
            value={yn(data.ivd.is_screening_or_staging)}
          />
        </dl>
      )}

      {data.device_type === "combination" && (
        <dl className="space-y-1">
          <Row
            label="Modo de acción primario"
            hint={FIELD_HINTS.combination.primary_mode_of_action}
            value={enumLabel(COMBINATION_PMOA, data.combination.primary_mode_of_action)}
          />
          <Row
            label="Acción de la sustancia"
            hint={FIELD_HINTS.combination.substance_action}
            value={enumLabel(
              COMBINATION_SUBSTANCE,
              data.combination.substance_action,
            )}
          />
          <Row
            label="Producto integral"
            hint={FIELD_HINTS.combination.is_integral}
            value={yn(data.combination.is_integral)}
          />
        </dl>
      )}

      <Separator />
      <FlagGroup
        title="Flags especiales"
        flags={SPECIAL_FLAGS.map((f) => ({
          label: f.label,
          hint: f.hint,
          value: data.special[f.key],
        }))}
      />
      <Separator />
      <FlagGroup
        title="Flags generales"
        flags={GENERAL_FLAGS.map((f) => ({
          label: f.label,
          hint: f.hint,
          value: data.general[f.key],
        }))}
      />
    </div>
  );
}
