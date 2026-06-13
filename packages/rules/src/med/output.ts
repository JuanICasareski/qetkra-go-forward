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
  // Versión del cuerpo de reglas usado para producir este resultado
  // (Flujo 7). Cada trámite la persiste para no perder el vínculo
  // producto ↔ versión de norma cuando las reglas cambian.
  rulesVersion: string;
};

export type EvalStandars = EvaluationResult["standards"];
export type EvalAuth = EvaluationResult["authorization"];
export type EvalReqs = EvaluationResult["requirements"];
