// AR — Documentacion y ensayos exigidos por ANMAT segun clase y caracteristicas

import type { MedicalProductFlags } from "#rules/med/types";
import type { EvalReqs } from "#rules/med/output";

import { classifyAR } from "#rules/med/core/applicable-standards/ar";
import { isSamd } from "#rules/med/core/shared";

export function getRequirements(flags: MedicalProductFlags): EvalReqs {
  const { deviceClass } = classifyAR(flags);
  const g = flags.general;
  const s = flags.special;
  const reqs: EvalReqs = [];

  reqs.push("Informe de Clasificacion de Riesgo (justificacion de clase)");
  reqs.push("Informe tecnico del producto");

  if (g.is_sterile) reqs.push("Validacion de esterilizacion");
  if (flags.is_active) {
    reqs.push("Seguridad electrica (IEC 60601-1)");
    reqs.push("Compatibilidad electromagnetica (IEC 60601-1-2)");
  }
  if (g.has_measuring_function) reqs.push("Validacion metrologica");
  if (flags.invasiveness !== "none") {
    reqs.push("Biocompatibilidad (ISO 10993)");
  }
  if (isSamd(flags)) reqs.push("Documentacion de software (ciclo de vida, IEC 62304)");
  if (s.has_pharmaceutical_substance) reqs.push("Evaluacion de la sustancia farmacologica");

  if (deviceClass === "III" || deviceClass === "IV") {
    reqs.push("Evaluacion de riesgo detallada (ISO 14971)");
    reqs.push("Datos preclinicos");
    reqs.push("Evidencia clinica");
    reqs.push("Certificado de Buenas Practicas de Fabricacion (BPF)");
  }
  if (deviceClass === "IV") {
    reqs.push("Datos clinicos completos + auditoria de BPF");
  }

  return reqs;
}
