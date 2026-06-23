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

export type Flag<K extends string> = { key: K; label: string; hint: string };

// Special flags ordenados por prioridad (mayor impacto regulatorio primero).
export const SPECIAL_FLAGS: Flag<keyof SpecialFlags>[] = [
  {
    key: "has_pharmaceutical_substance",
    label: "Incorpora sustancia farmacológica",
    hint: "El dispositivo incluye un fármaco con acción auxiliar sobre el cuerpo (p. ej. stent liberador de droga). Suele elevar la clase de riesgo.",
  },
  {
    key: "has_nonviable_biological_tissue",
    label: "Tejidos/células biológicas no viables",
    hint: "Contiene tejidos o derivados de origen humano o animal sin capacidad de vida (p. ej. colágeno, válvulas porcinas).",
  },
  {
    key: "is_closed_loop",
    label: "Lazo cerrado (terapia + diagnóstico)",
    hint: "Mide una variable del paciente y administra terapia automáticamente según esa medición, sin intervención humana (p. ej. bomba de insulina con sensor).",
  },
  {
    key: "has_systemically_absorbed_substance",
    label: "Sustancia con absorción sistémica",
    hint: "El producto introduce sustancias que se absorben en todo el organismo, no sólo localmente.",
  },
  {
    key: "is_breast_implant",
    label: "Implante mamario",
    hint: "Implante de mama. Categoría con régimen regulatorio específico y de alto riesgo.",
  },
  {
    key: "is_surgical_mesh",
    label: "Malla quirúrgica",
    hint: "Malla implantable para reforzar tejidos (p. ej. hernias, prolapsos).",
  },
  {
    key: "is_contraceptive",
    label: "Función anticonceptiva",
    hint: "Dispositivo destinado a prevenir el embarazo (p. ej. DIU, preservativo).",
  },
  {
    key: "is_std_prevention",
    label: "Prevención de ETS",
    hint: "Diseñado para prevenir la transmisión de enfermedades de transmisión sexual.",
  },
  {
    key: "delivers_inhaled_medication",
    label: "Administra medicación inhalada",
    hint: "Suministra fármacos por vía inhalatoria (p. ej. nebulizadores, inhaladores).",
  },
  {
    key: "has_nanomaterials",
    label: "Contiene nanomateriales",
    hint: "Incorpora nanomateriales con potencial exposición interna del paciente.",
  },
  {
    key: "emits_ionizing_radiation",
    label: "Emite radiación ionizante",
    hint: "Genera radiación ionizante con fines terapéuticos o de diagnóstico (p. ej. equipos de radioterapia).",
  },
  {
    key: "xray_image_recording",
    label: "Registro de imágenes por rayos X",
    hint: "Captura imágenes diagnósticas mediante rayos X (p. ej. radiografía, tomografía).",
  },
  {
    key: "has_recombinant_dna",
    label: "Contiene ADN recombinante",
    hint: "Incluye material genético recombinante o productos de ingeniería genética.",
  },
];

// General flags ordenados por prioridad.
export const GENERAL_FLAGS: Flag<keyof GeneralFlags>[] = [
  {
    key: "supports_life",
    label: "Sustenta la vida",
    hint: "Su fallo o ausencia pone en riesgo inmediato la vida del paciente (p. ej. respirador, desfibrilador).",
  },
  {
    key: "controls_implantable_device",
    label: "Controla un dispositivo implantable",
    hint: "Gobierna o programa un dispositivo activo implantado (p. ej. programador de marcapasos).",
  },
  {
    key: "is_joint_replacement",
    label: "Reemplazo articular",
    hint: "Prótesis que sustituye una articulación completa (cadera, rodilla, hombro).",
  },
  {
    key: "is_spinal_disc_implant",
    label: "Implante de disco/columna",
    hint: "Implante que reemplaza un disco intervertebral o estabiliza la columna.",
  },
  {
    key: "is_absorbable",
    label: "Absorbible",
    hint: "Está diseñado para reabsorberse o degradarse dentro del cuerpo con el tiempo.",
  },
  {
    key: "monitors_vital_params_immediate_danger",
    label: "Monitorea parámetros vitales (peligro inmediato)",
    hint: "Vigila signos vitales cuya variación implica peligro inmediato y requiere reacción urgente.",
  },
  {
    key: "delivers_potentially_dangerous_energy",
    label: "Entrega energía potencialmente peligrosa",
    hint: "Aplica energía (eléctrica, térmica, lumínica, ultrasónica) que puede dañar si se descontrola.",
  },
  {
    key: "administers_or_removes_substances",
    label: "Administra/extrae sustancias",
    hint: "Introduce o retira líquidos o sustancias del cuerpo (p. ej. bombas de infusión, sistemas de aspiración).",
  },
  {
    key: "modifies_biological_chemical_composition",
    label: "Modifica composición biológica/química",
    hint: "Altera la composición de sangre, fluidos u otros líquidos corporales (p. ej. diálisis, oxigenación).",
  },
  {
    key: "contacts_tissue_for_implant_in_vitro",
    label: "Contacto in vitro con tejido para implante",
    hint: "Entra en contacto con células o tejidos fuera del cuerpo que luego serán implantados.",
  },
  {
    key: "full_thickness_wound",
    label: "Heridas de espesor completo",
    hint: "Indicado para heridas que comprometen todas las capas de la piel (dermis completa).",
  },
  {
    key: "manages_wound_microenvironment",
    label: "Maneja el microentorno de la herida",
    hint: "Controla activamente las condiciones de la herida (humedad, presión, exudado).",
  },
  {
    key: "channels_or_stores_body_fluids",
    label: "Canaliza/almacena fluidos corporales",
    hint: "Conduce o contiene fluidos del cuerpo (p. ej. catéteres, bolsas colectoras).",
  },
  {
    key: "is_blood_bag",
    label: "Bolsa de sangre",
    hint: "Recipiente para recolección, almacenamiento o conservación de sangre.",
  },
  {
    key: "is_for_blood_transfusion_organ_transplant",
    label: "Transfusión / trasplante de órganos",
    hint: "Destinado a procesos de transfusión sanguínea o trasplante de órganos.",
  },
  {
    key: "contacts_injured_skin",
    label: "Contacta piel lesionada",
    hint: "Entra en contacto con piel dañada o mucosas (no piel intacta).",
  },
  {
    key: "is_dental_placement",
    label: "Colocación dental",
    hint: "Se coloca o fija en la cavidad dental (p. ej. coronas, implantes dentales).",
  },
  {
    key: "is_sterile",
    label: "Estéril",
    hint: "Se provee en estado estéril, lo que añade requisitos de proceso y validación.",
  },
  {
    key: "has_measuring_function",
    label: "Función de medición",
    hint: "Realiza mediciones cuyo resultado se usa clínicamente (requiere control metrológico).",
  },
  {
    key: "is_reusable",
    label: "Reutilizable",
    hint: "Diseñado para ser reprocesado y reutilizado, con requisitos de limpieza/esterilización.",
  },
];

// Descripciones de los campos base y type-specific (enums + bools), centralizadas
// para compartirlas entre el editor (sections) y el resumen (ProductSummary).
export const FIELD_HINTS = {
  base: {
    device_type:
      "Categoría general del producto. Determina qué flags específicos aplican y es la base de la clasificación.",
    invasiveness:
      "Grado en que el dispositivo penetra en el cuerpo: no invasivo, por orificio corporal, quirúrgico o implantable.",
    contact_nature:
      "Parte del cuerpo con la que el dispositivo entra en contacto. Cuanto más crítica (corazón, SNC), mayor el riesgo.",
    contact_duration:
      "Tiempo de contacto continuo con el cuerpo: transitorio (< 60 min), corto plazo (hasta 30 días) o prolongado (> 30 días).",
    is_active:
      "Funciona con una fuente de energía (eléctrica, etc.) distinta de la generada por el cuerpo o la gravedad.",
  },
  samd: {
    significance:
      "Cuánto pesa el software en la decisión clínica: informa, orienta o directamente trata/diagnostica.",
    condition_severity:
      "Gravedad de la situación clínica del paciente sobre la que actúa el software: no grave, grave o crítica.",
    is_ai_ml_enabled:
      "El software usa inteligencia artificial o aprendizaje automático para producir sus resultados.",
    controls_other_device:
      "El software comanda o ajusta el funcionamiento de otro dispositivo médico.",
  },
  ivd: {
    public_health_risk:
      "Impacto de un resultado erróneo a nivel poblacional (p. ej. detección de agentes que pueden causar brotes).",
    individual_risk:
      "Impacto de un resultado erróneo para el paciente concreto al que se le hace el test.",
    detects_transmissible_agent:
      "El test detecta agentes infecciosos transmisibles (virus, bacterias) en sangre, tejidos u órganos.",
    is_self_testing:
      "Diseñado para que el propio paciente lo use sin intervención de un profesional (p. ej. test de embarazo).",
    is_near_patient_testing:
      "Se realiza junto al paciente, fuera del laboratorio central (p. ej. en la guardia o consultorio).",
    is_control_or_calibrator:
      "Es un material de control o calibración usado para verificar o ajustar otros ensayos, no un test diagnóstico en sí.",
    is_screening_or_staging:
      "Se usa para tamizaje poblacional o para determinar el estadio de una enfermedad (p. ej. estadificación de un cáncer).",
  },
  combination: {
    primary_mode_of_action:
      "Cuál es el efecto principal del producto combinado: el del dispositivo, el del fármaco o el biológico. Define el marco regulatorio aplicable.",
    substance_action:
      "Rol de la sustancia dentro del producto: accesoria (apoya al dispositivo) o principal (es el efecto buscado).",
    is_integral:
      "Dispositivo y sustancia forman una unidad inseparable (un solo producto), no componentes que se usan por separado.",
  },
} as const;

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
