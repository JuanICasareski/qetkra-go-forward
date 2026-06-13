// Diff de propiedades de un producto para el log de auditoría (Flujo 7).
// Compara dos ProductData y devuelve un cambio por cada flag/atributo que
// se modificó, con los valores ya formateados a la etiqueta que ve el
// usuario (no el valor crudo).
import {
  BODY_AREAS,
  COMBINATION_FIELD_LABELS,
  COMBINATION_PMOA,
  COMBINATION_SUBSTANCE,
  CONTACT_DURATIONS,
  DEVICE_TYPES,
  GENERAL_FLAGS,
  INVASIVENESS,
  IVD_FIELD_LABELS,
  IVD_INDIVIDUAL,
  IVD_RISK3,
  SAMD_FIELD_LABELS,
  SAMD_SEVERITY,
  SAMD_SIGNIFICANCE,
  SPECIAL_FLAGS,
} from "@/eval/metadata";
import type { ProductData } from "@/eval/state";

export type FieldChange = { field: string; before: string; after: string };

const UNANSWERED = "Sin responder";

const enumLabel = <T extends string>(
  options: readonly { value: T; label: string }[],
  value: T | undefined,
) =>
  value === undefined
    ? UNANSWERED
    : (options.find((o) => o.value === value)?.label ?? value);

const yn = (v: boolean | undefined) =>
  v === undefined ? UNANSWERED : v ? "Sí" : "No";

export function diffProductData(
  before: ProductData,
  after: ProductData,
): FieldChange[] {
  const changes: FieldChange[] = [];
  const push = (field: string, b: string, a: string) => {
    if (b !== a) changes.push({ field, before: b, after: a });
  };

  // Atributos base.
  push("Tipo de dispositivo", enumLabel(DEVICE_TYPES, before.device_type), enumLabel(DEVICE_TYPES, after.device_type)); // prettier-ignore
  push("Invasividad", enumLabel(INVASIVENESS, before.invasiveness), enumLabel(INVASIVENESS, after.invasiveness)); // prettier-ignore
  push("Zona del cuerpo", enumLabel(BODY_AREAS, before.contact_nature), enumLabel(BODY_AREAS, after.contact_nature)); // prettier-ignore
  push("Duración de contacto", enumLabel(CONTACT_DURATIONS, before.contact_duration), enumLabel(CONTACT_DURATIONS, after.contact_duration)); // prettier-ignore
  push("Dispositivo activo", yn(before.is_active), yn(after.is_active));

  // Flags especiales y generales.
  for (const f of SPECIAL_FLAGS)
    push(f.label, yn(before.special[f.key]), yn(after.special[f.key]));
  for (const f of GENERAL_FLAGS)
    push(f.label, yn(before.general[f.key]), yn(after.general[f.key]));

  // Flags específicos del tipo.
  push(SAMD_FIELD_LABELS.significance, enumLabel(SAMD_SIGNIFICANCE, before.samd.significance), enumLabel(SAMD_SIGNIFICANCE, after.samd.significance)); // prettier-ignore
  push(SAMD_FIELD_LABELS.condition_severity, enumLabel(SAMD_SEVERITY, before.samd.condition_severity), enumLabel(SAMD_SEVERITY, after.samd.condition_severity)); // prettier-ignore
  push(SAMD_FIELD_LABELS.is_ai_ml_enabled, yn(before.samd.is_ai_ml_enabled), yn(after.samd.is_ai_ml_enabled)); // prettier-ignore
  push(SAMD_FIELD_LABELS.controls_other_device, yn(before.samd.controls_other_device), yn(after.samd.controls_other_device)); // prettier-ignore

  push(IVD_FIELD_LABELS.public_health_risk, enumLabel(IVD_RISK3, before.ivd.public_health_risk), enumLabel(IVD_RISK3, after.ivd.public_health_risk)); // prettier-ignore
  push(IVD_FIELD_LABELS.individual_risk, enumLabel(IVD_INDIVIDUAL, before.ivd.individual_risk), enumLabel(IVD_INDIVIDUAL, after.ivd.individual_risk)); // prettier-ignore
  push(IVD_FIELD_LABELS.detects_transmissible_agent, yn(before.ivd.detects_transmissible_agent), yn(after.ivd.detects_transmissible_agent)); // prettier-ignore
  push(IVD_FIELD_LABELS.is_self_testing, yn(before.ivd.is_self_testing), yn(after.ivd.is_self_testing)); // prettier-ignore
  push(IVD_FIELD_LABELS.is_near_patient_testing, yn(before.ivd.is_near_patient_testing), yn(after.ivd.is_near_patient_testing)); // prettier-ignore
  push(IVD_FIELD_LABELS.is_control_or_calibrator, yn(before.ivd.is_control_or_calibrator), yn(after.ivd.is_control_or_calibrator)); // prettier-ignore
  push(IVD_FIELD_LABELS.is_screening_or_staging, yn(before.ivd.is_screening_or_staging), yn(after.ivd.is_screening_or_staging)); // prettier-ignore

  push(COMBINATION_FIELD_LABELS.primary_mode_of_action, enumLabel(COMBINATION_PMOA, before.combination.primary_mode_of_action), enumLabel(COMBINATION_PMOA, after.combination.primary_mode_of_action)); // prettier-ignore
  push(COMBINATION_FIELD_LABELS.substance_action, enumLabel(COMBINATION_SUBSTANCE, before.combination.substance_action), enumLabel(COMBINATION_SUBSTANCE, after.combination.substance_action)); // prettier-ignore
  push(COMBINATION_FIELD_LABELS.is_integral, yn(before.combination.is_integral), yn(after.combination.is_integral)); // prettier-ignore

  return changes;
}
