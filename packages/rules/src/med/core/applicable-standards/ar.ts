// ANMAT — Normas aplicables
// (boilerplate vacio)

import type { MedicalProductFlags } from "#rules/med/types";
import type { Certainty, EvalStandars } from "#rules/med/output";

export function getClass(flags: MedicalProductFlags): {
  standards: EvalStandars;
  certainty: Certainty;
} {
  void flags;

  const standards: EvalStandars = [];
  const certainty: Certainty = "undetermined";

  return { standards, certainty };
}
