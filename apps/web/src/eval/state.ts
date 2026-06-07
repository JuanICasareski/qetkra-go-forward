import type {
  BodyArea,
  ContactDuration,
  DeviceType,
  GeneralFlags,
  Invasiveness,
  MedicalProductFlags,
  SpecialFlags,
} from "rules/med";

import type { CountryCode } from "./metadata";

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

export type FormState = {
  device_type: DeviceType;
  invasiveness: Invasiveness;
  is_active: boolean;
  contact_nature: BodyArea;
  contact_duration: ContactDuration;
  special: SpecialFlags;
  general: GeneralFlags;
  samd: SamdFlags;
  ivd: IvdFlags;
  combination: CombinationFlags;
  countries: Record<CountryCode, boolean>;
};

const allFalse = <K extends string>(keys: readonly K[]): Record<K, boolean> =>
  Object.fromEntries(keys.map((k) => [k, false])) as Record<K, boolean>;

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

export const initialState: FormState = {
  device_type: "implant",
  invasiveness: "none",
  is_active: false,
  contact_nature: "skin",
  contact_duration: "transient",
  special: allFalse(SPECIAL_KEYS) as SpecialFlags,
  general: allFalse(GENERAL_KEYS) as GeneralFlags,
  samd: {
    significance: "inform",
    condition_severity: "non_serious",
    is_ai_ml_enabled: false,
    controls_other_device: false,
  },
  ivd: {
    detects_transmissible_agent: false,
    public_health_risk: "none",
    individual_risk: "low",
    is_self_testing: false,
    is_near_patient_testing: false,
    is_control_or_calibrator: false,
    is_screening_or_staging: false,
  },
  combination: {
    primary_mode_of_action: "device",
    is_integral: false,
    substance_action: "ancillary",
  },
  countries: { ar: true, eu: true, us: true },
};

// Construye el objeto MedicalProductFlags que consumen los evaluadores,
// anidando los flags type-specific segun el device_type.
export function buildFlags(s: FormState): MedicalProductFlags {
  const general: Record<string, unknown> = { ...s.general };
  if (s.device_type === "samd") general.samd = s.samd;
  else if (s.device_type === "ivd") general.ivd = s.ivd;
  else if (s.device_type === "combination") general.combination = s.combination;

  return {
    device_type: s.device_type,
    invasiveness: s.invasiveness,
    is_active: s.is_active,
    contact_nature: s.contact_nature,
    contact_duration: s.contact_duration,
    special: s.special,
    general: general as MedicalProductFlags["general"],
  };
}
