// US — Clasificacion segun la FDA (FD&C Act Sec. 513, 21 CFR 860-892)
// Clases: I (General Controls) / II (510(k)) / III (PMA)
//
// La clasificacion FDA real se basa en la Product Classification Database
// (product code). Aca se aproxima por perfil de riesgo a partir de los flags,
// por eso la certeza suele ser "inferred".

import type { MedicalProductFlags } from "#rules/med/types";
import type { Certainty, EvalStandars } from "#rules/med/output";

import {
  US_RANK,
  contactsCritical,
  isSamd,
  pickWorst,
  type Candidate,
  type ClassResult,
} from "#rules/med/core/shared";

export function classifyUS(flags: MedicalProductFlags): ClassResult {
  const c: Candidate[] = [];
  const g = flags.general;
  const s = flags.special;
  const inv = flags.invasiveness;
  const dur = flags.contact_duration;

  // --- Clase III (PMA): sustenta vida o alto riesgo ---
  const classIII =
    g.supports_life ||
    s.has_pharmaceutical_substance ||
    s.has_nonviable_biological_tissue ||
    s.is_closed_loop ||
    s.is_breast_implant ||
    (inv === "implantable" &&
      (contactsCritical(flags) ||
        g.is_joint_replacement ||
        g.is_spinal_disc_implant ||
        flags.is_active));

  if (classIII) {
    c.push({
      cls: "III",
      rule: "Alto riesgo / sustenta vida / implante critico → PMA (Clase III)",
      certainty: "undetermined",
    });
  }

  // --- SaMD: matriz IMDRF mapeada a clases FDA ---
  if (isSamd(flags)) {
    const { significance, condition_severity } = flags.general.samd;
    // Cat IV → Clase III; Cat I → Clase I; resto → Clase II
    if (significance === "treat_or_diagnose" && condition_severity === "critical") {
      c.push({ cls: "III", rule: "SaMD IMDRF Cat. IV → PMA (Clase III)", certainty: "undetermined" });
    } else if (significance === "inform" && condition_severity !== "critical") {
      c.push({
        cls: "I",
        rule: "SaMD IMDRF Cat. I → enforcement discretion (Clase I)",
        certainty: "undetermined",
      });
    } else {
      c.push({
        cls: "II",
        rule: "SaMD IMDRF Cat. II/III → 510(k) o De Novo (Clase II)",
        certainty: "undetermined",
      });
    }
  }

  // --- Clase I (General Controls): bajo riesgo ---
  const lowRisk =
    inv === "none" &&
    !flags.is_active &&
    !g.is_sterile &&
    !g.has_measuring_function &&
    dur !== "long_term" &&
    !g.contacts_injured_skin &&
    !g.channels_or_stores_body_fluids &&
    !g.modifies_biological_chemical_composition;

  if (lowRisk) {
    c.push({
      cls: "I",
      rule: "Bajo riesgo — General Controls (Clase I, tipicamente exento de 510(k))",
      certainty: "undetermined",
    });
  }

  // Si no hay clase I ni III determinada, el caso general es Clase II (510(k)).
  const hasNonSamdSignal = c.some((x) => !x.rule.startsWith("SaMD"));
  if (!hasNonSamdSignal && !isSamd(flags)) {
    c.push({
      cls: "II",
      rule: "Riesgo moderado — 510(k) Premarket Notification (Clase II)",
      certainty: "undetermined",
    });
  }

  return pickWorst(US_RANK, c, "II");
}

export function getClass(flags: MedicalProductFlags): {
  standards: EvalStandars;
  certainty: Certainty;
} {
  const r = classifyUS(flags);
  return { standards: [`Clase ${r.deviceClass}`, ...r.rules], certainty: r.certainty };
}
