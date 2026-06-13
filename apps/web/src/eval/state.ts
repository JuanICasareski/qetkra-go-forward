import type {
  BodyArea,
  ContactDuration,
  DeviceType,
  GeneralFlags,
  Invasiveness,
  MedicalProductFlags,
  SpecialFlags,
} from "rules/med";

import {
  COMBINATION_FIELD_LABELS,
  GENERAL_FLAGS,
  IVD_FIELD_LABELS,
  SAMD_FIELD_LABELS,
  SPECIAL_FLAGS,
  type CountryCode,
} from "./metadata";

export type SamdFlags = {
  significance: "inform" | "drive" | "treat_or_diagnose";
  condition_severity: "non_serious" | "serious" | "critical";
  is_ai_ml_enabled: boolean;
  controls_other_device: boolean;
};

export type IvdFlags = {
  detects_transmissible_agent: boolean;
  public_health_risk: "none" | "moderate" | "high";
  individual_risk: "low" | "moderate" | "high";
  is_self_testing: boolean;
  is_near_patient_testing: boolean;
  is_control_or_calibrator: boolean;
  is_screening_or_staging: boolean;
};

export type CombinationFlags = {
  primary_mode_of_action: "device" | "drug" | "biologic";
  is_integral: boolean;
  substance_action: "ancillary" | "principal";
};

// Toda propiedad puede quedar sin responder (undefined). Mientras haya
// campos sin responder no se puede determinar la clase del producto.
export type Tri<T> = { [K in keyof T]: T[K] | undefined };

export type FormState = {
  device_type: DeviceType | undefined;
  invasiveness: Invasiveness | undefined;
  is_active: boolean | undefined;
  contact_nature: BodyArea | undefined;
  contact_duration: ContactDuration | undefined;
  special: Tri<SpecialFlags>;
  general: Tri<GeneralFlags>;
  samd: Tri<SamdFlags>;
  ivd: Tri<IvdFlags>;
  combination: Tri<CombinationFlags>;
  countries: Record<CountryCode, boolean>;
};

// Datos del producto: el FormState sin la selección de países (que es
// propia de la evaluación, no del producto).
export type ProductData = Omit<FormState, "countries">;

const allUndefined = <K extends string, V>(
  keys: readonly K[],
): Record<K, V | undefined> =>
  Object.fromEntries(keys.map((k) => [k, undefined])) as Record<
    K,
    V | undefined
  >;

const SPECIAL_KEYS: (keyof SpecialFlags)[] = [
  "has_pharmaceutical_substance",
  "has_nonviable_biological_tissue",
  "has_nanomaterials",
  "is_closed_loop",
  "is_contraceptive",
  "is_std_prevention",
  "delivers_inhaled_medication",
  "has_systemically_absorbed_substance",
  "emits_ionizing_radiation",
  "xray_image_recording",
  "has_recombinant_dna",
  "is_breast_implant",
  "is_surgical_mesh",
];

const GENERAL_KEYS: (keyof GeneralFlags)[] = [
  "is_sterile",
  "has_measuring_function",
  "is_reusable",
  "is_absorbable",
  "modifies_biological_chemical_composition",
  "channels_or_stores_body_fluids",
  "contacts_injured_skin",
  "delivers_potentially_dangerous_energy",
  "monitors_vital_params_immediate_danger",
  "administers_or_removes_substances",
  "is_dental_placement",
  "manages_wound_microenvironment",
  "full_thickness_wound",
  "is_blood_bag",
  "contacts_tissue_for_implant_in_vitro",
  "controls_implantable_device",
  "is_joint_replacement",
  "is_spinal_disc_implant",
  "supports_life",
  "is_for_blood_transfusion_organ_transplant",
];

const SAMD_KEYS: (keyof SamdFlags)[] = [
  "significance",
  "condition_severity",
  "is_ai_ml_enabled",
  "controls_other_device",
];

const IVD_KEYS: (keyof IvdFlags)[] = [
  "detects_transmissible_agent",
  "public_health_risk",
  "individual_risk",
  "is_self_testing",
  "is_near_patient_testing",
  "is_control_or_calibrator",
  "is_screening_or_staging",
];

const COMBINATION_KEYS: (keyof CombinationFlags)[] = [
  "primary_mode_of_action",
  "is_integral",
  "substance_action",
];

export const emptyProductData: ProductData = {
  device_type: undefined,
  invasiveness: undefined,
  is_active: undefined,
  contact_nature: undefined,
  contact_duration: undefined,
  special: allUndefined(SPECIAL_KEYS),
  general: allUndefined(GENERAL_KEYS),
  samd: allUndefined(SAMD_KEYS) as Tri<SamdFlags>,
  ivd: allUndefined(IVD_KEYS) as Tri<IvdFlags>,
  combination: allUndefined(COMBINATION_KEYS) as Tri<CombinationFlags>,
};

export const initialState: FormState = {
  ...emptyProductData,
  countries: { ar: true, eu: true, us: true },
};

const BASE_FIELD_LABELS: [keyof ProductData, string][] = [
  ["device_type", "Tipo de dispositivo"],
  ["invasiveness", "Invasividad"],
  ["contact_nature", "Zona del cuerpo"],
  ["contact_duration", "Duración de contacto"],
  ["is_active", "Dispositivo activo"],
];

// Lista de campos sin responder. Un producto con campos pendientes no
// puede ser clasificado (métrica del charter: productos incompletos <15%).
export function missingFields(s: ProductData): string[] {
  const missing: string[] = [];

  for (const [key, label] of BASE_FIELD_LABELS)
    if (s[key] === undefined) missing.push(label);

  for (const f of SPECIAL_FLAGS)
    if (s.special[f.key] === undefined) missing.push(f.label);
  for (const f of GENERAL_FLAGS)
    if (s.general[f.key] === undefined) missing.push(f.label);

  if (s.device_type === "samd")
    for (const k of SAMD_KEYS)
      if (s.samd[k] === undefined) missing.push(SAMD_FIELD_LABELS[k]);
  if (s.device_type === "ivd")
    for (const k of IVD_KEYS)
      if (s.ivd[k] === undefined) missing.push(IVD_FIELD_LABELS[k]);
  if (s.device_type === "combination")
    for (const k of COMBINATION_KEYS)
      if (s.combination[k] === undefined)
        missing.push(COMBINATION_FIELD_LABELS[k]);

  return missing;
}

export const isComplete = (s: ProductData): boolean =>
  missingFields(s).length === 0;

// Id de ancla DOM de cada campo, para poder scrollear hasta él. Se usa en
// los componentes (al pintar el campo) y en `firstMissingAnchor` (al buscar
// el primero sin responder), de modo que ambos lados queden sincronizados.
export const FIELD_ANCHOR = {
  base: (key: keyof ProductData) => `field-${key}`,
  flag: (
    group: "special" | "general" | "samd" | "ivd" | "combination",
    key: string,
  ) => `field-${group}-${key}`,
};

// Ancla del primer campo sin responder, en el mismo orden visual que el
// formulario. Devuelve null si el producto está completo. Lo usa el editor
// para llevar la pantalla justo a la respuesta que falta (Flujo 1).
export function firstMissingAnchor(s: ProductData): string | null {
  for (const [key] of BASE_FIELD_LABELS)
    if (s[key] === undefined) return FIELD_ANCHOR.base(key);

  for (const f of SPECIAL_FLAGS)
    if (s.special[f.key] === undefined) return FIELD_ANCHOR.flag("special", f.key);
  for (const f of GENERAL_FLAGS)
    if (s.general[f.key] === undefined) return FIELD_ANCHOR.flag("general", f.key);

  if (s.device_type === "samd")
    for (const k of SAMD_KEYS)
      if (s.samd[k] === undefined) return FIELD_ANCHOR.flag("samd", k);
  if (s.device_type === "ivd")
    for (const k of IVD_KEYS)
      if (s.ivd[k] === undefined) return FIELD_ANCHOR.flag("ivd", k);
  if (s.device_type === "combination")
    for (const k of COMBINATION_KEYS)
      if (s.combination[k] === undefined)
        return FIELD_ANCHOR.flag("combination", k);

  return null;
}

// Construye el objeto MedicalProductFlags que consumen los evaluadores.
// Devuelve null si el producto está incompleto: con campos sin responder
// no se puede determinar la clase ni la necesidad de aprobación.
export function buildFlags(s: ProductData): MedicalProductFlags | null {
  if (!isComplete(s)) return null;

  const general: Record<string, unknown> = { ...s.general };
  if (s.device_type === "samd") general.samd = s.samd;
  else if (s.device_type === "ivd") general.ivd = s.ivd;
  else if (s.device_type === "combination") general.combination = s.combination;

  return {
    device_type: s.device_type!,
    invasiveness: s.invasiveness!,
    is_active: s.is_active!,
    contact_nature: s.contact_nature!,
    contact_duration: s.contact_duration!,
    special: s.special as SpecialFlags,
    general: general as MedicalProductFlags["general"],
  };
}

// Completa los campos sin responder con valores por defecto (útil en el
// sandbox para probar las funciones sin cargar todo a mano).
export function fillDefaults<T extends ProductData>(s: T): T {
  const fillBools = <F extends object>(group: Tri<F>): Tri<F> =>
    Object.fromEntries(
      Object.entries(group).map(([k, v]) => [k, v ?? false]),
    ) as Tri<F>;

  return {
    ...s,
    device_type: s.device_type ?? "implant",
    invasiveness: s.invasiveness ?? "none",
    is_active: s.is_active ?? false,
    contact_nature: s.contact_nature ?? "skin",
    contact_duration: s.contact_duration ?? "transient",
    special: fillBools(s.special),
    general: fillBools(s.general),
    samd: {
      significance: s.samd.significance ?? "inform",
      condition_severity: s.samd.condition_severity ?? "non_serious",
      is_ai_ml_enabled: s.samd.is_ai_ml_enabled ?? false,
      controls_other_device: s.samd.controls_other_device ?? false,
    },
    ivd: {
      detects_transmissible_agent: s.ivd.detects_transmissible_agent ?? false,
      public_health_risk: s.ivd.public_health_risk ?? "none",
      individual_risk: s.ivd.individual_risk ?? "low",
      is_self_testing: s.ivd.is_self_testing ?? false,
      is_near_patient_testing: s.ivd.is_near_patient_testing ?? false,
      is_control_or_calibrator: s.ivd.is_control_or_calibrator ?? false,
      is_screening_or_staging: s.ivd.is_screening_or_staging ?? false,
    },
    combination: {
      primary_mode_of_action: s.combination.primary_mode_of_action ?? "device",
      is_integral: s.combination.is_integral ?? false,
      substance_action: s.combination.substance_action ?? "ancillary",
    },
  };
}
