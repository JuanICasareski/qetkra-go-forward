// ANMAT — Autorizacion / registro del producto medico
// (boilerplate vacio)

import type { MedicalProductFlags } from "#rules/med/types";
import type { EvalAuth } from "#rules/med/output";

export function getAuthorization(flags: MedicalProductFlags): EvalAuth {
  void flags;

  const auth: EvalAuth = [];

  return auth;
}
