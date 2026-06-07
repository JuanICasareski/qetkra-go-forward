// US — Via regulatoria ante la FDA segun la clase

import type { MedicalProductFlags } from "#rules/med/types";
import type { EvalAuth } from "#rules/med/output";

import { classifyUS } from "#rules/med/core/applicable-standards/us";
import { isCombination, isSamd } from "#rules/med/core/shared";

export function getAuthorization(flags: MedicalProductFlags): EvalAuth {
  const { deviceClass } = classifyUS(flags);
  const auth: EvalAuth = [];

  switch (deviceClass) {
    case "I":
      auth.push("Registro de establecimiento + Device Listing + General Controls (tipicamente exento de 510(k))");
      break;
    case "II":
      auth.push("510(k) Premarket Notification (equivalencia sustancial con predicado)");
      auth.push("De Novo Classification Request si no hay predicado valido");
      break;
    case "III":
      auth.push("PMA — Premarket Approval (datos clinicos + IDE)");
      break;
    default:
      auth.push("Via a determinar (clasificacion no concluyente)");
  }

  if (isSamd(flags) && flags.general.samd.is_ai_ml_enabled) {
    auth.push("Predetermined Change Control Plan (PCCP) para actualizaciones de IA/ML");
  }

  if (isCombination(flags)) {
    const center =
      flags.general.combination.primary_mode_of_action === "drug"
        ? "CDER (componente farmacologico como PMOA)"
        : flags.general.combination.primary_mode_of_action === "biologic"
          ? "CBER (componente biologico como PMOA)"
          : "CDRH (componente dispositivo como PMOA)";
    auth.push(`Producto combinado — centro revisor: ${center} (21 CFR Part 3)`);
  }

  return auth;
}
