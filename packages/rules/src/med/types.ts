// ============================================================
// Tipos extraidos de src/types/medical.ts
// ============================================================

export type DeviceType =
  | "implant" //              dispositivo implantado total o parcialmente en el cuerpo
  | "surgical_instrument" //  instrumental quirurgico (bisturis, pinzas, etc.)
  | "diagnostic_imaging" //   equipo de diagnostico por imagenes (TAC, RMN, ecografo)
  | "monitoring" //           monitoreo de parametros del paciente (signos vitales)
  | "therapeutic" //          dispositivo terapeutico (laser, electroterapia, etc.)
  | "electromedical" //       equipo electromedico general
  | "ivd" //                  diagnostico in vitro (reactivos, analizadores de muestras)
  | "samd" //                 Software as a Medical Device (software como dispositivo)
  | "prosthetic" //           protesis (reemplazo de parte del cuerpo)
  | "orthosis" //             ortesis (soporte/correccion externa: ferulas, fajas)
  | "dental" //               dispositivo odontologico
  | "ophthalmic" //           dispositivo oftalmico (lentes, equipos para el ojo)
  | "wound_care" //           cuidado de heridas (apositos, vendajes)
  | "consumable" //           consumible de un solo uso
  | "support" //              accesorio / equipo de soporte
  | "disinfection" //         desinfeccion / esterilizacion
  | "combination"; //         producto combinado (dispositivo + farmaco)

export type BodyArea =
  | "skin" //                 piel intacta
  | "injured_skin" //         piel lesionada / mucosas
  | "ent_anterior" //         cavidad nasal/oido/boca hasta faringe/laringe (parte anterior)
  | "ent_posterior" //        mas alla de faringe/laringe (parte posterior de las vias)
  | "eye" //                  ojo (superficie ocular)
  | "gastrointestinal" //     tracto gastrointestinal
  | "respiratory" //          tracto respiratorio
  | "urogenital" //           tracto urogenital
  | "musculoskeletal" //      sistema musculoesqueletico
  | "dental" //               cavidad / estructura dental
  | "spinal_column" //        columna vertebral
  | "cardiovascular" //       sistema cardiovascular (vasos perifericos)
  | "central_circulatory" //  sistema circulatorio central (grandes vasos)
  | "heart" //                corazon
  | "cns" //                  sistema nervioso central
  | "reproductive"; //        sistema reproductivo

export type Invasiveness =
  | "none" //         no invasivo: no penetra el cuerpo
  | "body_orifice" // invasivo por orificio corporal natural
  | "surgical" //     invasivo por via quirurgica
  | "implantable"; // implantable (queda dentro del cuerpo)

// Duracion de contacto segun categorias armonizadas GHTF/IMDRF (EU MDR Anexo VIII §1).
export type ContactDuration =
  | "transient" //  < 60 minutos
  | "short_term" // 60 min - 30 dias
  | "long_term"; // > 30 dias (uso continuo/repetido del mismo dispositivo se acumula)

export type SpecialFlags = {
  has_pharmaceutical_substance: boolean;
  has_nonviable_biological_tissue: boolean;
  has_nanomaterials: boolean;
  is_closed_loop: boolean;
  is_contraceptive: boolean;
  is_std_prevention: boolean;
  delivers_inhaled_medication: boolean;
  has_systemically_absorbed_substance: boolean;
  emits_ionizing_radiation: boolean;
  xray_image_recording: boolean;
  has_recombinant_dna: boolean;
  is_breast_implant: boolean;
  is_surgical_mesh: boolean;
};

export type GeneralFlags = {
  is_sterile: boolean;
  has_measuring_function: boolean;
  is_reusable: boolean;
  is_absorbable: boolean;
  modifies_biological_chemical_composition: boolean;
  channels_or_stores_body_fluids: boolean;
  contacts_injured_skin: boolean;
  delivers_potentially_dangerous_energy: boolean;
  monitors_vital_params_immediate_danger: boolean;
  administers_or_removes_substances: boolean;
  is_dental_placement: boolean;
  manages_wound_microenvironment: boolean;
  full_thickness_wound: boolean;
  is_blood_bag: boolean;
  contacts_tissue_for_implant_in_vitro: boolean;
  controls_implantable_device: boolean;
  is_joint_replacement: boolean;
  is_spinal_disc_implant: boolean;
  supports_life: boolean;
  is_for_blood_transfusion_organ_transplant: boolean;
};

type TypeSpecificFlags = {
  samd: {
    // Significancia de la informacion para la decision clinica (eje X matriz IMDRF).
    significance:
      | "inform" //             solo informa la decision clinica
      | "drive" //              guia/orienta la decision clinica
      | "treat_or_diagnose"; // trata o diagnostica directamente
    // Gravedad de la condicion de salud que aborda (eje Y matriz IMDRF).
    condition_severity:
      | "non_serious" // condicion no grave
      | "serious" //     condicion grave
      | "critical"; //   condicion critica
    is_ai_ml_enabled: boolean;
    controls_other_device: boolean;
  };
  ivd: {
    // Detecta agente transmisible en sangre/tejidos o de alto riesgo de propagacion (IVDR R1 -> D).
    detects_transmissible_agent: boolean;
    // Riesgo de propagacion a la comunidad ante resultado erroneo (eje salud publica IMDRF).
    public_health_risk:
      | "none" //     sin impacto poblacional
      | "moderate" // riesgo de propagacion limitado
      | "high"; //    agente potencialmente mortal, alta propagacion
    // Impacto del resultado en la decision clinica individual (eje riesgo individual IMDRF).
    individual_risk:
      | "low" //      bajo impacto individual
      | "moderate" // influye en el manejo del paciente
      | "high"; //    determina una decision critica
    is_self_testing: boolean; //         autodiagnostico por el paciente (IVDR R4 -> C)
    is_near_patient_testing: boolean; // test point-of-care (agravante)
    is_control_or_calibrator: boolean; // control/calibrador (IVDR R5 -> B)
    is_screening_or_staging: boolean; //  tamizaje o estadificacion (IVDR R3 -> C)
  };
  combination: {
    // Modo de accion primario -> define autoridad reguladora (FDA: CDRH/CDER/CBER).
    primary_mode_of_action:
      | "device" //   accion principal fisica/mecanica (device-led)
      | "drug" //     accion principal farmacologica (drug-led)
      | "biologic"; // accion principal biologica (biologic-led)
    is_integral: boolean; // producto integral unico vs co-empaquetado (EU MDR Art 117)
    // Rol de la sustancia farmacologica respecto al dispositivo (EU MDR R14).
    substance_action:
      | "ancillary" // accesoria a la del dispositivo
      | "principal"; // principal del producto
  };
};

type TypeSpecificFlag = {
  [K in keyof TypeSpecificFlags]: Record<K & string, TypeSpecificFlags[K]>;
};

type TypeGeneralFlags<T extends DeviceType> =
  T extends keyof TypeSpecificFlag
    ? GeneralFlags & TypeSpecificFlag[T]
    : GeneralFlags;

export type MedicalProductFlags<Type extends DeviceType = DeviceType> = {
  device_type: Type;
  invasiveness: Invasiveness;
  is_active: boolean;
  contact_nature: BodyArea;
  contact_duration: ContactDuration;
  special: SpecialFlags;
  general: TypeGeneralFlags<Type>;
};
