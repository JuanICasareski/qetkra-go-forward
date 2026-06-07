// US (FDA) — Evaluacion completa del producto medico
// Combina: applicable-standards, authorization, requirements

import type { MedicalProductFlags } from "#rules/med/types";
import type { EvaluationResult } from "#rules/med/output";

import { getClass } from "../core/applicable-standards/us";
import { getAuthorization } from "../core/authorization/us";
import { getRequirements } from "../core/requirements/us";

export default function evaluateUS(flags: MedicalProductFlags): EvaluationResult {
  const { standards, certainty } = getClass(flags);
  const authorization = getAuthorization(flags);
  const requirements = getRequirements(flags);

  return { certainty, authorization, standards, requirements };
}
