// US — Documentacion y ensayos exigidos por la FDA segun clase y caracteristicas

import type { MedicalProductFlags } from "#rules/med/types";
import type { EvalReqs } from "#rules/med/output";

import { classifyUS } from "#rules/med/core/applicable-standards/us";
import { isSamd } from "#rules/med/core/shared";

export function getRequirements(flags: MedicalProductFlags): EvalReqs {
  const { deviceClass } = classifyUS(flags);
  const g = flags.general;
  const reqs: EvalReqs = [];

  reqs.push("Registro de establecimiento + Device Listing");
  reqs.push("Quality System Regulation (21 CFR 820)");
  reqs.push("Etiquetado conforme + Medical Device Reporting (MDR)");

  if (deviceClass === "II") {
    reqs.push("Identificacion de dispositivo predicado");
    reqs.push("Bench testing y comparacion de desempeno");
  }

  if (g.is_sterile) reqs.push("Validacion de esterilizacion");
  if (flags.is_active) {
    reqs.push("Seguridad electrica y EMC (IEC 60601 / ANSI C63)");
  }
  if (flags.invasiveness !== "none") reqs.push("Biocompatibilidad (ISO 10993)");
  if (isSamd(flags)) reqs.push("Documentacion de software (FDA SW guidance, IEC 62304)");

  if (deviceClass === "III") {
    reqs.push("Datos clinicos de ensayos controlados (pivotal)");
    reqs.push("IDE — Investigational Device Exemption (21 CFR 812)");
    reqs.push("Inspeccion de planta de fabricacion");
  }

  return reqs;
}
