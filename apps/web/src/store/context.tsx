import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { EvaluationResult } from "rules/med";

import type { CountryCode } from "@/eval/metadata";
import type { ProductData } from "@/eval/state";

import { diffProductData } from "./audit";
import {
  CASE_TRANSITIONS,
  canTransition,
  type AppNotification,
  type AuditEntity,
  type AuditEntry,
  type Case,
  type CaseStatus,
  type Product,
  type ProductStatus,
  type Role,
} from "./types";

// Persistencia en localStorage. En producción esta capa se reemplaza por
// la API REST contra el backend de Qetkra (PostgreSQL) y las notificaciones
// por la cola de mensajes descripta en el Enfoque; el resto de la app solo
// conoce las acciones de este contexto.
const KEYS = {
  products: "qetkra.products",
  cases: "qetkra.cases",
  notifications: "qetkra.notifications",
  audit: "qetkra.audit",
  role: "qetkra.role",
} as const;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

const save = (key: string, value: unknown) =>
  localStorage.setItem(key, JSON.stringify(value));

type ResolveCaseOutcome = {
  approve: boolean;
  correctedClass?: string;
  note?: string;
};

type StoreValue = {
  role: Role;
  setRole: (r: Role) => void;

  products: Product[];
  createProduct: (
    name: string,
    manufacturer: string,
    data: ProductData,
  ) => Product;
  updateProduct: (
    id: string,
    patch: Partial<Pick<Product, "name" | "manufacturer" | "data">>,
  ) => void;
  deleteProduct: (id: string) => void;
  // Transición de estado validada contra PRODUCT_TRANSITIONS; ignora
  // transiciones ilegales en vez de corromper el ciclo de vida.
  setProductStatus: (id: string, status: ProductStatus) => void;

  cases: Case[];
  // Crea el trámite a partir del snapshot de evaluate(). Si la certeza
  // no es "certain" entra a la cola de revisión del staff.
  createCase: (
    productId: string,
    country: CountryCode,
    result: EvaluationResult,
  ) => Case;
  resolveCase: (id: string, outcome: ResolveCaseOutcome) => void;

  notifications: AppNotification[];
  markAllRead: (role: Role) => void;

  // Log de auditoría (Flujo 7), más reciente primero al filtrar.
  audit: AuditEntry[];
  auditFor: (entity: AuditEntity, entityId: string) => AuditEntry[];
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(() => load(KEYS.role, "client"));
  const [products, setProducts] = useState<Product[]>(() =>
    load(KEYS.products, []),
  );
  const [cases, setCases] = useState<Case[]>(() => load(KEYS.cases, []));
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    load(KEYS.notifications, []),
  );
  const [audit, setAudit] = useState<AuditEntry[]>(() => load(KEYS.audit, []));

  useEffect(() => save(KEYS.role, role), [role]);
  useEffect(() => save(KEYS.products, products), [products]);
  useEffect(() => save(KEYS.cases, cases), [cases]);
  useEffect(() => save(KEYS.notifications, notifications), [notifications]);
  useEffect(() => save(KEYS.audit, audit), [audit]);

  const value = useMemo<StoreValue>(() => {
    const now = () => new Date().toISOString();
    const touch = <T extends { updatedAt: string }>(x: T): T => ({
      ...x,
      updatedAt: now(),
    });

    // Simula el evento asíncrono de la cola de mensajes: notifica al rol
    // contrario sin bloquear la acción del usuario.
    const notify = (to: Role, message: string) =>
      setNotifications((prev) => [
        ...prev,
        { id: crypto.randomUUID(), to, message, read: false, createdAt: now() },
      ]);

    // Asienta una o varias entradas en el log de auditoría (Flujo 7).
    // El actor es el rol activo: quién hizo el cambio queda registrado.
    const record = (entries: Omit<AuditEntry, "id" | "timestamp" | "actor">[]) =>
      setAudit((prev) => [
        ...prev,
        ...entries.map((e) => ({
          ...e,
          id: crypto.randomUUID(),
          timestamp: now(),
          actor: role,
        })),
      ]);

    const productName = (id: string) =>
      products.find((p) => p.id === id)?.name ?? "Producto";

    return {
      role,
      setRole,
      products,

      createProduct: (name, manufacturer, data) => {
        const product: Product = {
          id: crypto.randomUUID(),
          name,
          manufacturer,
          data,
          status: "draft",
          createdAt: now(),
          updatedAt: now(),
        };
        setProducts((prev) => [...prev, product]);
        record([
          {
            entity: "product",
            entityId: product.id,
            action: `Producto creado: "${name}"`,
          },
        ]);
        return product;
      },

      updateProduct: (id, patch) => {
        const prev = products.find((p) => p.id === id);
        setProducts((list) =>
          list.map((p) => (p.id === id ? touch({ ...p, ...patch }) : p)),
        );
        // Un cambio por cada flag/atributo modificado, con antes/después.
        if (prev && patch.data) {
          record(
            diffProductData(prev.data, patch.data).map((c) => ({
              entity: "product",
              entityId: id,
              action: "Propiedad modificada",
              field: c.field,
              before: c.before,
              after: c.after,
            })),
          );
        }
      },

      deleteProduct: (id) => {
        const prev = products.find((p) => p.id === id);
        setProducts((list) => list.filter((p) => p.id !== id));
        if (prev)
          record([
            {
              entity: "product",
              entityId: id,
              action: `Producto eliminado: "${prev.name}"`,
            },
          ]);
      },

      setProductStatus: (id, status) => {
        const product = products.find((p) => p.id === id);
        if (!product || !canTransition(product.status, status)) return;

        setProducts((prev) =>
          prev.map((p) => (p.id === id ? touch({ ...p, status }) : p)),
        );

        record([
          {
            entity: "product",
            entityId: id,
            action: "Cambio de estado",
            field: "Estado",
            before: product.status,
            after: status,
          },
        ]);

        if (status === "pending_validation")
          notify("staff", `Nuevo producto para validar: ${product.name}`);
        else if (status === "validated")
          notify("client", `Tus propiedades de "${product.name}" fueron validadas.`);
        else if (status === "rejected")
          notify("client", `"${product.name}" fue observado: revisá sus propiedades.`);
      },

      cases,

      createCase: (productId, country, result) => {
        const needsReview = result.certainty !== "certain";
        const item: Case = {
          id: crypto.randomUUID(),
          productId,
          country,
          result,
          finalClass: result.standards[0] ?? "—",
          certitude: "algorithm",
          rulesVersion: result.rulesVersion,
          status: needsReview ? "pending_review" : "classified",
          createdAt: now(),
          updatedAt: now(),
        };
        setCases((prev) => [...prev, item]);

        record([
          {
            entity: "case",
            entityId: item.id,
            action: `Trámite iniciado: ${productName(productId)} (${country.toUpperCase()}) · clase ${item.finalClass} · reglas v${result.rulesVersion}`,
          },
        ]);

        if (needsReview)
          notify(
            "staff",
            `Nueva clase para revisar: ${productName(productId)} (${country.toUpperCase()})`,
          );
        return item;
      },

      resolveCase: (id, outcome) => {
        const item = cases.find((c) => c.id === id);
        if (!item) return;
        const to: CaseStatus = outcome.approve ? "classified" : "rejected";
        if (!CASE_TRANSITIONS[item.status].includes(to)) return;

        setCases((prev) =>
          prev.map((c) =>
            c.id === id
              ? touch({
                  ...c,
                  status: to,
                  certitude: "human",
                  finalClass: outcome.approve
                    ? (outcome.correctedClass?.trim() || c.finalClass)
                    : c.finalClass,
                  reviewNote: outcome.note?.trim() || undefined,
                })
              : c,
          ),
        );

        const name = productName(item.productId);
        const country = item.country.toUpperCase();

        const newClass = outcome.approve
          ? outcome.correctedClass?.trim() || item.finalClass
          : item.finalClass;
        record([
          {
            entity: "case",
            entityId: item.id,
            action: outcome.approve
              ? "Clase validada por humano"
              : "Clasificación observada",
            field: "Clase",
            before: item.finalClass,
            after: newClass,
          },
        ]);

        notify(
          "client",
          outcome.approve
            ? `La clase de "${name}" (${country}) fue validada por el staff.`
            : `La clasificación de "${name}" (${country}) fue observada por el staff.`,
        );
      },

      notifications,

      markAllRead: (target) =>
        setNotifications((prev) =>
          prev.map((n) => (n.to === target ? { ...n, read: true } : n)),
        ),

      audit,

      auditFor: (entity, entityId) =>
        audit
          .filter((e) => e.entity === entity && e.entityId === entityId)
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    };
  }, [role, products, cases, notifications, audit]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore debe usarse dentro de <StoreProvider>");
  return ctx;
}
