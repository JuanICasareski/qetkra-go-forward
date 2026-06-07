// UE — Documentacion y requisitos exigidos por el MDR segun clase y caracteristicas

import type { MedicalProductFlags } from "#rules/med/types";
import type { EvalReqs } from "#rules/med/output";

import { classifyEU } from "#rules/med/core/applicable-standards/eu";
import { isSamd } from "#rules/med/core/shared";

export function getRequirements(flags: MedicalProductFlags): EvalReqs {
  const { deviceClass } = classifyEU(flags);
  const g = flags.general;
  const reqs: EvalReqs = [];

  reqs.push("Documentacion tecnica (Anexo II MDR)");
  reqs.push("Evaluacion clinica (Art. 61, Anexo XIV)");
  reqs.push("Gestion de riesgos (ISO 14971)");
  reqs.push("UDI — Unique Device Identification");
  reqs.push("Vigilancia post-mercado (Art. 83-86)");

  if (g.is_sterile) reqs.push("Validacion de esterilizacion");
  if (flags.is_active) {
    reqs.push("Seguridad electrica (IEC 60601-1)");
    reqs.push("Compatibilidad electromagnetica (IEC 60601-1-2)");
  }
  if (flags.invasiveness !== "none") reqs.push("Biocompatibilidad (ISO 10993)");
  if (isSamd(flags)) reqs.push("Documentacion de software (IEC 62304)");

  if (deviceClass === "III" && flags.invasiveness === "implantable") {
    reqs.push("Consulta a panel de expertos (implante Clase III)");
    reqs.push("Resumen de seguridad y comportamiento clinico (SSCP)");
  }

  return reqs;
}
