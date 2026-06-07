import type { MedicalProductFlags } from "#rules/med/types";
import type { EvaluationResult } from "#rules/med/output";

import { getClass } from "../core/applicable-standards/ar";
import { getAuthorization } from "../core/authorization/ar";
import { getRequirements } from "../core/requirements/ar";

export default function evaluateAR(
  flags: MedicalProductFlags,
): EvaluationResult {
  const { standards, certainty } = getClass(flags); // función de clase
  const authorization = getAuthorization(flags); // función autorización
  const requirements = getRequirements(flags); // documentación necesaria

  return { certainty, authorization, standards, requirements };
}
