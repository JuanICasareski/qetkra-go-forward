import type { CaseStatus, Certitude } from "@/store/types";

export const CASE_STATUS_LABEL: Record<CaseStatus, string> = {
  pending_review: "Pendiente de validación",
  classified: "Clasificado",
  rejected: "Observado",
};

export const CASE_STATUS_STYLE: Record<CaseStatus, string> = {
  pending_review:
    "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  classified:
    "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  rejected:
    "border-transparent bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export const CERTITUDE_LABEL: Record<Certitude, string> = {
  algorithm: "Asignada por algoritmo",
  human: "Validada por humano",
};
