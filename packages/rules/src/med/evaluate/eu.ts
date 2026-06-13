// UE (MDR) — Evaluacion completa del producto medico
// Combina: applicable-standards, authorization, requirements

import type { MedicalProductFlags } from "#rules/med/types";
import type { EvaluationResult } from "#rules/med/output";

import { getClass } from "../core/applicable-standards/eu";
import { getAuthorization } from "../core/authorization/eu";
import { getRequirements } from "../core/requirements/eu";
import { RULES_VERSION } from "../version";

export default function evaluateEU(flags: MedicalProductFlags): EvaluationResult {
  const { standards, certainty } = getClass(flags);
  const authorization = getAuthorization(flags);
  const requirements = getRequirements(flags);

  return { certainty, authorization, standards, requirements, rulesVersion: RULES_VERSION };
}
