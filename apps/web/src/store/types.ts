import type { EvaluationResult } from "rules/med";

import type { CountryCode } from "@/eval/metadata";
import type { ProductData } from "@/eval/state";

// Quién opera la app. Simulado con un toggle en el header: no hay auth
// real, pero toda la lógica de permisos/colas se escribe contra este rol
// para que migrar a auth de verdad sea solo cambiar la fuente.
export type Role = "client" | "staff";

// Ciclo de vida del producto (Flujo 1):
//   draft               el cliente lo está cargando, puede estar incompleto
//   pending_validation  enviado; espera validación asincrónica del staff
//   validated           propiedades aprobadas por un empleado de Qetkra
//   rejected            propiedades observadas; vuelve al cliente
export type ProductStatus =
  | "draft"
  | "pending_validation"
  | "validated"
  | "rejected";

export const PRODUCT_TRANSITIONS: Record<ProductStatus, ProductStatus[]> = {
  draft: ["pending_validation"],
  pending_validation: ["validated", "rejected"],
  validated: ["draft"], // editar un producto validado lo devuelve a borrador
  rejected: ["draft"],
};

export type Product = {
  id: string;
  name: string;
  manufacturer: string;
  data: ProductData;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};

export const canTransition = (
  from: ProductStatus,
  to: ProductStatus,
): boolean => PRODUCT_TRANSITIONS[from].includes(to);

// Ciclo de vida del trámite de clasificación (Flujo 4). Un trámite es
// una evaluación por producto por país:
//   pending_review  la certeza no fue "certain": el staff debe revisar
//   classified      clase determinada (por algoritmo o validada por humano)
//   rejected        el staff observó la clasificación
export type CaseStatus = "pending_review" | "classified" | "rejected";

export const CASE_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  pending_review: ["classified", "rejected"],
  classified: [],
  rejected: [],
};

// Certitud (modelo de datos del Enfoque): si la clase fue asignada por
// el algoritmo o validada por un humano.
export type Certitude = "algorithm" | "human";

export type Case = {
  id: string;
  productId: string;
  country: CountryCode;
  // Snapshot del resultado de evaluate() al momento de crear el trámite.
  result: EvaluationResult;
  // Clase vigente: arranca como standards[0] y el staff puede corregirla.
  finalClass: string;
  certitude: Certitude;
  // Versión de las reglas con la que se evaluó el trámite (Flujo 7).
  // Copiada del snapshot para dejar el vínculo producto ↔ norma explícito
  // aunque el cuerpo de reglas avance después.
  rulesVersion: string;
  status: CaseStatus;
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
};

export type AppNotification = {
  id: string;
  to: Role;
  message: string;
  read: boolean;
  createdAt: string;
};

// Log de auditoría (Flujo 7): registra quién y cuándo cambió cada cosa.
// Cubre tanto cambios de propiedades/flags del producto (con valor
// anterior y nuevo) como transiciones de estado de productos y trámites.
export type AuditEntity = "product" | "case";

export type AuditEntry = {
  id: string;
  timestamp: string;
  actor: Role; // rol que ejecutó la acción
  entity: AuditEntity;
  entityId: string;
  action: string; // descripción legible de la acción
  field?: string; // propiedad afectada (en cambios de flags)
  before?: string; // valor anterior, ya formateado a etiqueta
  after?: string; // valor nuevo, ya formateado a etiqueta
};
