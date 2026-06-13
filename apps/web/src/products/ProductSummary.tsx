import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BODY_AREAS,
  COMBINATION_PMOA,
  COMBINATION_SUBSTANCE,
  CONTACT_DURATIONS,
  DEVICE_TYPES,
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

function Row(props: { label: string; value: string }) {
  const unanswered = props.value === "Sin responder";
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted-foreground">{props.label}</dt>
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
  flags: { label: string; value: boolean | undefined }[];
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
            <Badge key={f.label} variant="secondary">
              {f.label}
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
              className="text-muted-foreground"
            >
              {f.label}: sin responder
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
        <Row label="Tipo" value={enumLabel(DEVICE_TYPES, data.device_type)} />
        <Row
          label="Invasividad"
          value={enumLabel(INVASIVENESS, data.invasiveness)}
        />
        <Row label="Zona" value={enumLabel(BODY_AREAS, data.contact_nature)} />
        <Row
          label="Duración"
          value={enumLabel(CONTACT_DURATIONS, data.contact_duration)}
        />
        <Row label="Activo" value={yn(data.is_active)} />
      </dl>

      {data.device_type === "samd" && (
        <dl className="space-y-1">
          <Row
            label="Significancia"
            value={enumLabel(SAMD_SIGNIFICANCE, data.samd.significance)}
          />
          <Row
            label="Gravedad de la condición"
            value={enumLabel(SAMD_SEVERITY, data.samd.condition_severity)}
          />
          <Row label="Habilitado por IA/ML" value={yn(data.samd.is_ai_ml_enabled)} />
          <Row
            label="Controla otro dispositivo"
            value={yn(data.samd.controls_other_device)}
          />
        </dl>
      )}

      {data.device_type === "ivd" && (
        <dl className="space-y-1">
          <Row
            label="Riesgo de salud pública"
            value={enumLabel(IVD_RISK3, data.ivd.public_health_risk)}
          />
          <Row
            label="Riesgo individual"
            value={enumLabel(IVD_INDIVIDUAL, data.ivd.individual_risk)}
          />
          <Row
            label="Detecta agente transmisible"
            value={yn(data.ivd.detects_transmissible_agent)}
          />
          <Row label="Autodiagnóstico" value={yn(data.ivd.is_self_testing)} />
          <Row label="Point-of-care" value={yn(data.ivd.is_near_patient_testing)} />
          <Row
            label="Control / calibrador"
            value={yn(data.ivd.is_control_or_calibrator)}
          />
          <Row
            label="Tamizaje / estadificación"
            value={yn(data.ivd.is_screening_or_staging)}
          />
        </dl>
      )}

      {data.device_type === "combination" && (
        <dl className="space-y-1">
          <Row
            label="Modo de acción primario"
            value={enumLabel(COMBINATION_PMOA, data.combination.primary_mode_of_action)}
          />
          <Row
            label="Acción de la sustancia"
            value={enumLabel(
              COMBINATION_SUBSTANCE,
              data.combination.substance_action,
            )}
          />
          <Row label="Producto integral" value={yn(data.combination.is_integral)} />
        </dl>
      )}

      <Separator />
      <FlagGroup
        title="Flags especiales"
        flags={SPECIAL_FLAGS.map((f) => ({
          label: f.label,
          value: data.special[f.key],
        }))}
      />
      <Separator />
      <FlagGroup
        title="Flags generales"
        flags={GENERAL_FLAGS.map((f) => ({
          label: f.label,
          value: data.general[f.key],
        }))}
      />
    </div>
  );
}
