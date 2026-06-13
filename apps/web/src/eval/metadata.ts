import type {
  BodyArea,
  ContactDuration,
  DeviceType,
  GeneralFlags,
  Invasiveness,
  SpecialFlags,
} from "rules/med";

export type Option<T extends string> = { value: T; label: string };

export const DEVICE_TYPES: Option<DeviceType>[] = [
  { value: "implant", label: "Implante" },
  { value: "surgical_instrument", label: "Instrumental quirúrgico" },
  { value: "diagnostic_imaging", label: "Diagnóstico por imágenes" },
  { value: "monitoring", label: "Monitoreo" },
  { value: "therapeutic", label: "Terapéutico" },
  { value: "electromedical", label: "Electromédico" },
  { value: "ivd", label: "Diagnóstico in vitro (IVD)" },
  { value: "samd", label: "Software (SaMD)" },
  { value: "prosthetic", label: "Prótesis" },
  { value: "orthosis", label: "Ortesis" },
  { value: "dental", label: "Odontológico" },
  { value: "ophthalmic", label: "Oftálmico" },
  { value: "wound_care", label: "Cuidado de heridas" },
  { value: "consumable", label: "Consumible" },
  { value: "support", label: "Soporte / accesorio" },
  { value: "disinfection", label: "Desinfección / esterilización" },
  { value: "combination", label: "Combinado (disp. + fármaco)" },
];

export const INVASIVENESS: Option<Invasiveness>[] = [
  { value: "none", label: "No invasivo" },
  { value: "body_orifice", label: "Por orificio corporal" },
  { value: "surgical", label: "Quirúrgico" },
  { value: "implantable", label: "Implantable" },
];

export const BODY_AREAS: Option<BodyArea>[] = [
  { value: "skin", label: "Piel intacta" },
  { value: "injured_skin", label: "Piel lesionada / mucosas" },
  { value: "ent_anterior", label: "ORL anterior" },
  { value: "ent_posterior", label: "ORL posterior" },
  { value: "eye", label: "Ojo" },
  { value: "gastrointestinal", label: "Gastrointestinal" },
  { value: "respiratory", label: "Respiratorio" },
  { value: "urogenital", label: "Urogenital" },
  { value: "musculoskeletal", label: "Musculoesquelético" },
  { value: "dental", label: "Dental" },
  { value: "spinal_column", label: "Columna vertebral" },
  { value: "cardiovascular", label: "Cardiovascular periférico" },
  { value: "central_circulatory", label: "Circulatorio central" },
  { value: "heart", label: "Corazón" },
  { value: "cns", label: "Sistema nervioso central" },
  { value: "reproductive", label: "Reproductivo" },
];

export const CONTACT_DURATIONS: Option<ContactDuration>[] = [
  { value: "transient", label: "Transitorio (< 60 min)" },
  { value: "short_term", label: "Corto plazo (60 min – 30 d)" },
  { value: "long_term", label: "Prolongado (> 30 d)" },
];

export const COUNTRIES = [
  { value: "ar", label: "Argentina (ANMAT)" },
  { value: "eu", label: "Unión Europea (MDR)" },
  { value: "us", label: "Estados Unidos (FDA)" },
] as const;

export type CountryCode = (typeof COUNTRIES)[number]["value"];

// Special flags ordenados por prioridad (mayor impacto regulatorio primero).
export const SPECIAL_FLAGS: { key: keyof SpecialFlags; label: string }[] = [
  { key: "has_pharmaceutical_substance", label: "Incorpora sustancia farmacológica" },
  { key: "has_nonviable_biological_tissue", label: "Tejidos/células biológicas no viables" },
  { key: "is_closed_loop", label: "Lazo cerrado (terapia + diagnóstico)" },
  { key: "has_systemically_absorbed_substance", label: "Sustancia con absorción sistémica" },
  { key: "is_breast_implant", label: "Implante mamario" },
  { key: "is_surgical_mesh", label: "Malla quirúrgica" },
  { key: "is_contraceptive", label: "Función anticonceptiva" },
  { key: "is_std_prevention", label: "Prevención de ETS" },
  { key: "delivers_inhaled_medication", label: "Administra medicación inhalada" },
  { key: "has_nanomaterials", label: "Contiene nanomateriales" },
  { key: "emits_ionizing_radiation", label: "Emite radiación ionizante" },
  { key: "xray_image_recording", label: "Registro de imágenes por rayos X" },
  { key: "has_recombinant_dna", label: "Contiene ADN recombinante" },
];

// General flags ordenados por prioridad.
export const GENERAL_FLAGS: { key: keyof GeneralFlags; label: string }[] = [
  { key: "supports_life", label: "Sustenta la vida" },
  { key: "controls_implantable_device", label: "Controla un dispositivo implantable" },
  { key: "is_joint_replacement", label: "Reemplazo articular" },
  { key: "is_spinal_disc_implant", label: "Implante de disco/columna" },
  { key: "is_absorbable", label: "Absorbible" },
  { key: "monitors_vital_params_immediate_danger", label: "Monitorea parámetros vitales (peligro inmediato)" },
  { key: "delivers_potentially_dangerous_energy", label: "Entrega energía potencialmente peligrosa" },
  { key: "administers_or_removes_substances", label: "Administra/extrae sustancias" },
  { key: "modifies_biological_chemical_composition", label: "Modifica composición biológica/química" },
  { key: "contacts_tissue_for_implant_in_vitro", label: "Contacto in vitro con tejido para implante" },
  { key: "full_thickness_wound", label: "Heridas de espesor completo" },
  { key: "manages_wound_microenvironment", label: "Maneja el microentorno de la herida" },
  { key: "channels_or_stores_body_fluids", label: "Canaliza/almacena fluidos corporales" },
  { key: "is_blood_bag", label: "Bolsa de sangre" },
  { key: "is_for_blood_transfusion_organ_transplant", label: "Transfusión / trasplante de órganos" },
  { key: "contacts_injured_skin", label: "Contacta piel lesionada" },
  { key: "is_dental_placement", label: "Colocación dental" },
  { key: "is_sterile", label: "Estéril" },
  { key: "has_measuring_function", label: "Función de medición" },
  { key: "is_reusable", label: "Reutilizable" },
];

// Opciones de los flags type-specific.
export const SAMD_SIGNIFICANCE: Option<"inform" | "drive" | "treat_or_diagnose">[] = [
  { value: "inform", label: "Informa la decisión" },
  { value: "drive", label: "Orienta la decisión" },
  { value: "treat_or_diagnose", label: "Trata o diagnostica" },
];

export const SAMD_SEVERITY: Option<"non_serious" | "serious" | "critical">[] = [
  { value: "non_serious", label: "No grave" },
  { value: "serious", label: "Grave" },
  { value: "critical", label: "Crítica" },
];

export const COMBINATION_PMOA: Option<"device" | "drug" | "biologic">[] = [
  { value: "device", label: "Dispositivo" },
  { value: "drug", label: "Fármaco" },
  { value: "biologic", label: "Biológico" },
];

export const COMBINATION_SUBSTANCE: Option<"ancillary" | "principal">[] = [
  { value: "ancillary", label: "Accesoria" },
  { value: "principal", label: "Principal" },
];

// Labels de los campos type-specific, usados para reportar campos faltantes.
export const SAMD_FIELD_LABELS = {
  significance: "Significancia (decisión clínica)",
  condition_severity: "Gravedad de la condición",
  is_ai_ml_enabled: "Habilitado por IA/ML",
  controls_other_device: "Controla otro dispositivo",
} as const;

export const IVD_FIELD_LABELS = {
  detects_transmissible_agent: "Detecta agente transmisible",
  public_health_risk: "Riesgo de salud pública",
  individual_risk: "Riesgo individual",
  is_self_testing: "Autodiagnóstico",
  is_near_patient_testing: "Point-of-care",
  is_control_or_calibrator: "Control / calibrador",
  is_screening_or_staging: "Tamizaje / estadificación",
} as const;

export const COMBINATION_FIELD_LABELS = {
  primary_mode_of_action: "Modo de acción primario",
  is_integral: "Producto integral",
  substance_action: "Acción de la sustancia",
} as const;

export const IVD_RISK3 = [
  { value: "none", label: "Ninguno" },
  { value: "moderate", label: "Moderado" },
  { value: "high", label: "Alto" },
] as const;

export const IVD_INDIVIDUAL = [
  { value: "low", label: "Bajo" },
  { value: "moderate", label: "Moderado" },
  { value: "high", label: "Alto" },
] as const;
