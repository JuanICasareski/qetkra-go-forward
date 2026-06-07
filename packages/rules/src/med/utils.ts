import type { Certainty } from "#rules/med/output";

const CERTAINTY_RANK: Record<Certainty, number> = {
  certain: 0,
  inferred: 1,
  undetermined: 2,
};

export function worstCertainty(a: Certainty, b: Certainty): Certainty {
  return CERTAINTY_RANK[a] >= CERTAINTY_RANK[b] ? a : b;
}
