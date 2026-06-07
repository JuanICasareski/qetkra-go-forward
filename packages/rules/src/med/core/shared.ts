// Helpers compartidos por los clasificadores de cada jurisdiccion.

import type { MedicalProductFlags } from "#rules/med/types";
import type { Certainty } from "#rules/med/output";
import { worstCertainty } from "#rules/med/utils";

// Resultado estructurado de una clasificacion (interno).
export type ClassResult = {
  deviceClass: string;
  rules: string[];
  certainty: Certainty;
};

// Candidato de clase generado por una regla.
export type Candidate = {
  cls: string;
  rule: string;
  certainty?: Certainty;
};

// Ranking de riesgo por jurisdiccion (mayor numero = mayor riesgo).
export const EU_RANK: Record<string, number> = {
  I: 1,
  Is: 1,
  Im: 1,
  Ir: 1,
  IIa: 2,
  IIb: 3,
  III: 4,
};

export const AR_RANK: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4 };

export const US_RANK: Record<string, number> = { I: 1, II: 2, III: 3 };

// Zonas del cuerpo que disparan automaticamente la clase mas alta.
export function contactsCritical(flags: MedicalProductFlags): boolean {
  return (
    flags.contact_nature === "heart" ||
    flags.contact_nature === "central_circulatory" ||
    flags.contact_nature === "cns"
  );
}

export function isSamd(
  flags: MedicalProductFlags,
): flags is MedicalProductFlags<"samd"> {
  return flags.device_type === "samd";
}

export function isCombination(
  flags: MedicalProductFlags,
): flags is MedicalProductFlags<"combination"> {
  return flags.device_type === "combination";
}

// Elige el candidato de mayor riesgo y acumula las reglas aplicadas.
export function pickWorst(
  rank: Record<string, number>,
  candidates: Candidate[],
  fallbackClass: string,
): ClassResult {
  if (candidates.length === 0) {
    return {
      deviceClass: fallbackClass,
      rules: ["Sin regla especifica identificada — requiere analisis manual"],
      certainty: "undetermined",
    };
  }

  let worst = candidates[0];
  for (const c of candidates) {
    if ((rank[c.cls] ?? 0) > (rank[worst.cls] ?? 0)) worst = c;
  }

  let certainty: Certainty = "certain";
  for (const c of candidates) {
    certainty = worstCertainty(certainty, c.certainty ?? "certain");
  }

  const rules = candidates.map((c) => `Clase ${c.cls} — ${c.rule}`);

  return { deviceClass: worst.cls, rules, certainty };
}
