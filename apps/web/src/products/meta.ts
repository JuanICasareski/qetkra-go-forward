import type { ProductStatus } from "@/store/types";

export const STATUS_LABEL: Record<ProductStatus, string> = {
  draft: "Borrador",
  pending_validation: "Pendiente de validación",
  validated: "Validado",
  rejected: "Observado",
};

export const STATUS_STYLE: Record<ProductStatus, string> = {
  draft:
    "border-transparent bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  pending_validation:
    "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  validated:
    "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  rejected:
    "border-transparent bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
