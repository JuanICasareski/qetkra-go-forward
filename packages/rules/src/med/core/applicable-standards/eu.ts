// UE — Clasificacion segun MDR 2017/745, Anexo VIII (22 reglas)
// Clases: I / Is / Im / Ir / IIa / IIb / III

import type { MedicalProductFlags } from "#rules/med/types";
import type { Certainty, EvalStandars } from "#rules/med/output";

import {
  EU_RANK,
  contactsCritical,
  isSamd,
  pickWorst,
  type Candidate,
  type ClassResult,
} from "#rules/med/core/shared";

export function classifyEU(flags: MedicalProductFlags): ClassResult {
  const c: Candidate[] = [];
  const g = flags.general;
  const s = flags.special;
  const inv = flags.invasiveness;
  const dur = flags.contact_duration;

  // --- Grupo 1: no invasivos (Reglas 1-4) ---
  if (inv === "none") {
    c.push({ cls: "I", rule: "Regla 1 — no invasivo (general)" });

    if (g.is_blood_bag) {
      c.push({ cls: "IIb", rule: "Regla 2 — bolsa de sangre" });
    } else if (g.channels_or_stores_body_fluids) {
      c.push({
        cls: "IIa",
        rule: "Regla 2 — canalizacion/almacenamiento de fluidos",
      });
    }

    if (g.contacts_tissue_for_implant_in_vitro) {
      c.push({
        cls: "III",
        rule: "Regla 3 — contacto in vitro con tejidos destinados a implante",
      });
    } else if (g.modifies_biological_chemical_composition) {
      c.push({
        cls: "IIb",
        rule: "Regla 3 — modificacion de composicion biologica/quimica",
      });
    }

    if (g.contacts_injured_skin || flags.contact_nature === "injured_skin") {
      if (g.full_thickness_wound) {
        c.push({ cls: "IIb", rule: "Regla 4 — heridas de espesor completo" });
      } else if (g.manages_wound_microenvironment) {
        c.push({
          cls: "IIa",
          rule: "Regla 4 — manejo del microentorno de la herida",
        });
      } else {
        c.push({ cls: "I", rule: "Regla 4 — barrera mecanica en piel lesionada" });
      }
    }
  }

  // --- Grupo 2: invasivos (Reglas 5-8) ---
  if (inv === "body_orifice") {
    if (dur === "transient") {
      c.push({ cls: "I", rule: "Regla 5 — invasivo por orificio, transitorio" });
    } else if (dur === "short_term") {
      c.push({ cls: "IIa", rule: "Regla 5 — invasivo por orificio, corto plazo" });
    } else {
      c.push({ cls: "IIb", rule: "Regla 5 — invasivo por orificio, prolongado" });
    }
  }

  if (inv === "surgical" && dur === "transient") {
    if (contactsCritical(flags)) {
      c.push({
        cls: "III",
        rule: "Regla 6 — quirurgico transitorio en contacto con corazon/SNC/circulatorio central",
      });
    } else if (
      s.emits_ionizing_radiation ||
      g.is_absorbable ||
      g.administers_or_removes_substances
    ) {
      c.push({
        cls: "IIb",
        rule: "Regla 6 — quirurgico transitorio (radiacion/absorbible/administra sustancias)",
      });
    } else if (flags.device_type === "surgical_instrument" && g.is_reusable) {
      c.push({ cls: "I", rule: "Regla 6 — instrumento quirurgico reutilizable" });
    } else {
      c.push({ cls: "IIa", rule: "Regla 6 — quirurgico transitorio (general)" });
    }
  }

  if (inv === "surgical" && dur === "short_term") {
    if (g.is_absorbable || contactsCritical(flags)) {
      c.push({
        cls: "III",
        rule: "Regla 7 — quirurgico corto plazo (absorbible o contacto critico)",
      });
    } else if (
      s.emits_ionizing_radiation ||
      g.administers_or_removes_substances ||
      (g.modifies_biological_chemical_composition && flags.device_type !== "dental")
    ) {
      c.push({
        cls: "IIb",
        rule: "Regla 7 — quirurgico corto plazo (radiacion/cambios quimicos/administra sustancias)",
      });
    } else {
      c.push({ cls: "IIa", rule: "Regla 7 — quirurgico corto plazo (general)" });
    }
  }

  if (inv === "implantable" || (inv === "surgical" && dur === "long_term")) {
    const special =
      contactsCritical(flags) ||
      g.is_absorbable ||
      g.modifies_biological_chemical_composition ||
      g.administers_or_removes_substances ||
      flags.is_active ||
      s.is_breast_implant ||
      s.is_surgical_mesh ||
      g.is_joint_replacement ||
      g.is_spinal_disc_implant ||
      s.has_nonviable_biological_tissue;

    if (special) {
      c.push({
        cls: "III",
        rule: "Regla 8 — implantable/uso prolongado con condicion especial",
      });
    } else if (g.is_dental_placement) {
      c.push({ cls: "IIa", rule: "Regla 8 — colocacion dental" });
    } else {
      c.push({ cls: "IIb", rule: "Regla 8 — implantable/uso prolongado (general)" });
    }
  }

  // --- Grupo 3: activos (Reglas 9-13) ---
  if (flags.is_active) {
    if (flags.device_type === "therapeutic" || g.delivers_potentially_dangerous_energy) {
      if (g.controls_implantable_device) {
        c.push({
          cls: "III",
          rule: "Regla 9 — controla un dispositivo implantable activo",
        });
      } else if (g.delivers_potentially_dangerous_energy) {
        c.push({ cls: "IIb", rule: "Regla 9 — energia potencialmente peligrosa" });
      } else {
        c.push({ cls: "IIa", rule: "Regla 9 — activo terapeutico (general)" });
      }
    }

    if (
      flags.device_type === "diagnostic_imaging" ||
      flags.device_type === "monitoring"
    ) {
      if (g.monitors_vital_params_immediate_danger || s.emits_ionizing_radiation) {
        c.push({
          cls: "IIb",
          rule: "Regla 10 — parametros vitales con peligro inmediato / radiacion ionizante",
        });
      } else {
        c.push({ cls: "IIa", rule: "Regla 10 — activo de diagnostico/monitoreo" });
      }
    }

    if (g.administers_or_removes_substances) {
      if (g.delivers_potentially_dangerous_energy) {
        c.push({ cls: "IIb", rule: "Regla 12 — administracion potencialmente peligrosa" });
      } else {
        c.push({ cls: "IIa", rule: "Regla 12 — administra/extrae sustancias" });
      }
    }

    c.push({ cls: "I", rule: "Regla 13 — otros activos (residual)" });
  }

  // Regla 11 — software (SaMD)
  if (isSamd(flags)) {
    const { significance, condition_severity } = flags.general.samd;
    if (significance === "inform" && condition_severity === "non_serious") {
      c.push({
        cls: "I",
        rule: "Regla 11 — software no determinante para decisiones clinicas",
      });
    } else if (
      significance === "treat_or_diagnose" &&
      condition_severity === "critical"
    ) {
      c.push({
        cls: "III",
        rule: "Regla 11 — software cuyas decisiones pueden causar muerte/deterioro irreversible",
      });
    } else if (
      condition_severity === "critical" ||
      condition_severity === "serious"
    ) {
      c.push({
        cls: "IIb",
        rule: "Regla 11 — software cuyas decisiones pueden causar deterioro grave/intervencion",
      });
    } else {
      c.push({
        cls: "IIa",
        rule: "Regla 11 — software para decisiones diagnosticas/terapeuticas (general)",
      });
    }
  }

  // --- Grupo 4: reglas especiales (Reglas 14-22) ---
  if (s.has_pharmaceutical_substance) {
    c.push({ cls: "III", rule: "Regla 14 — sustancia medicinal incorporada" });
  }
  if (s.is_contraceptive || s.is_std_prevention) {
    if (inv === "implantable" || dur === "long_term") {
      c.push({
        cls: "III",
        rule: "Regla 15 — anticoncepcion/ETS implantable o de uso prolongado",
      });
    } else {
      c.push({ cls: "IIb", rule: "Regla 15 — anticoncepcion/prevencion de ETS" });
    }
  }
  if (flags.device_type === "disinfection") {
    if (inv !== "none") {
      c.push({ cls: "IIb", rule: "Regla 16 — desinfeccion de PM invasivos" });
    } else {
      c.push({ cls: "IIa", rule: "Regla 16 — desinfeccion/limpieza de PM" });
    }
  }
  if (s.xray_image_recording) {
    c.push({ cls: "IIa", rule: "Regla 17 — registro de imagenes de rayos X" });
  }
  if (s.has_nonviable_biological_tissue) {
    c.push({ cls: "III", rule: "Regla 18 — tejidos/celulas no viables" });
  }
  if (s.has_nanomaterials) {
    c.push({
      cls: "IIb",
      rule: "Regla 19 — nanomateriales (exposicion no especificada; puede ser III)",
      certainty: "inferred",
    });
  }
  if (s.delivers_inhaled_medication) {
    c.push({ cls: "IIa", rule: "Regla 20 — medicamentos inhalados" });
  }
  if (s.has_systemically_absorbed_substance) {
    c.push({ cls: "III", rule: "Regla 21 — sustancia con absorcion sistemica" });
  }
  if (s.is_closed_loop) {
    c.push({
      cls: "III",
      rule: "Regla 22 — activo terapeutico con diagnostico integrado (lazo cerrado)",
    });
  }

  const result = pickWorst(EU_RANK, c, "I");

  // Subcategorias de Clase I (requieren Organismo Notificado para aspectos especificos)
  if (result.deviceClass === "I") {
    const subs: string[] = [];
    if (g.is_sterile) subs.push("Is");
    if (g.has_measuring_function) subs.push("Im");
    if (flags.device_type === "surgical_instrument" && g.is_reusable) subs.push("Ir");
    if (subs.length > 0) {
      result.deviceClass = subs.join("/");
      result.rules.push(
        `Clase I con subcategoria(s) ${subs.join(", ")} — requiere Organismo Notificado para aspectos especificos`,
      );
    }
  }

  return result;
}

export function getClass(flags: MedicalProductFlags): {
  standards: EvalStandars;
  certainty: Certainty;
} {
  const r = classifyEU(flags);
  return { standards: [`Clase ${r.deviceClass}`, ...r.rules], certainty: r.certainty };
}
