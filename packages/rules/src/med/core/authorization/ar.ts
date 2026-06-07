// AR — Via de registro ante ANMAT segun la clase (Disp. 9688/2019)

import type { MedicalProductFlags } from "#rules/med/types";
import type { EvalAuth } from "#rules/med/output";

import { classifyAR } from "#rules/med/core/applicable-standards/ar";

export function getAuthorization(flags: MedicalProductFlags): EvalAuth {
  const { deviceClass } = classifyAR(flags);
  const g = flags.general;
  const auth: EvalAuth = [];

  switch (deviceClass) {
    case "I": {
      if (g.is_sterile || flags.is_active || g.has_measuring_function) {
        auth.push("Declaracion de Conformidad (Anexo III, Disp. 9688/2019) — 30 dias habiles");
      } else {
        auth.push("Declaracion Jurada (Anexo II Parte B, Disp. 9688/2019) — automatico");
      }
      break;
    }
    case "II":
      auth.push("Registro con documentacion tecnica estandar — 60 dias habiles");
      break;
    case "III":
      auth.push("Registro con documentacion tecnica ampliada — 90 dias habiles");
      break;
    case "IV":
      auth.push("Registro con documentacion tecnica completa — 120 dias habiles");
      break;
    default:
      auth.push("Via de registro a determinar (clasificacion no concluyente)");
  }

  auth.push("Presentacion por Sistema HELENA (ANMAT)");
  return auth;
}
