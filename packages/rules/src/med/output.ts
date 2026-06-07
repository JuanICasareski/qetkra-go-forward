// ============================================================
// Tipos de salida de la evaluacion
// (copiados de @qetkra/rules src/types.ts)
// ============================================================

export type Certainty = "certain" | "inferred" | "undetermined";

export type EvaluationResult<C extends Certainty = Certainty> = {
  certainty: C;
  authorization: string[];
  standards: string[];
  requirements: string[];
};

export type EvalStandars = EvaluationResult["standards"];
export type EvalAuth = EvaluationResult["authorization"];
export type EvalReqs = EvaluationResult["requirements"];
