// UE — Procedimiento de evaluacion de conformidad segun la clase (MDR)

import type { MedicalProductFlags } from "#rules/med/types";
import type { EvalAuth } from "#rules/med/output";

import { classifyEU } from "#rules/med/core/applicable-standards/eu";

export function getAuthorization(flags: MedicalProductFlags): EvalAuth {
  const { deviceClass } = classifyEU(flags);
  const auth: EvalAuth = [];

  if (deviceClass === "I") {
    auth.push("Autocertificacion + marcado CE (Declaracion de Conformidad UE, Art. 19)");
  } else if (deviceClass.includes("Is") || deviceClass.includes("Im") || deviceClass.includes("Ir")) {
    auth.push("Organismo Notificado (aspectos especificos) — Anexo IX o XI + marcado CE");
  } else if (deviceClass === "IIa") {
    auth.push("Organismo Notificado — Anexo IX o XI + marcado CE");
  } else if (deviceClass === "IIb") {
    auth.push("Organismo Notificado (mayor escrutinio) — Anexo IX o XI + marcado CE");
  } else if (deviceClass === "III") {
    auth.push("Organismo Notificado (maximo escrutinio) — Anexo IX o X + XI + marcado CE");
    if (flags.invasiveness === "implantable") {
      auth.push("Consulta a panel de expertos (implante Clase III)");
    }
  } else {
    auth.push("Procedimiento a determinar (clasificacion no concluyente)");
  }

  return auth;
}
