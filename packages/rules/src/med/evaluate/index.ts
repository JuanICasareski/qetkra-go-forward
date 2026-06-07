import type { MedicalProductFlags } from "#rules/med/types";
import type { EvaluationResult } from "#rules/med/output";

import evaluateAR from "./ar";
import evaluateEU from "./eu";
import evaluateUS from "./us";

type EvaluateFn = (flags: MedicalProductFlags) => EvaluationResult;

const evaluators: Record<string, EvaluateFn | undefined> = {
  ar: evaluateAR,
  eu: evaluateEU,
  us: evaluateUS,
};

const fallback: EvaluateFn = () => ({
  certainty: "undetermined",
  authorization: [],
  standards: [],
  requirements: [],
});

export default function evaluate(
  country: string,
  flags: MedicalProductFlags,
): EvaluationResult {
  const fn = evaluators[country] ?? fallback;
  return fn(flags);
}
