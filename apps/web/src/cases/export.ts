// Flujo 6 — Exportación del expediente a HELENA/ANMAT.
// Según el Enfoque, la etapa de "Carga" del pipeline es la presentación a
// mano del dataset final al sistema del ente regulador: el entregable es un
// archivo descargable, no una integración en vivo. Acá se arma ese dataset
// (función pura) a partir de un trámite ya clasificado y su producto.
import {
  BODY_AREAS,
  CONTACT_DURATIONS,
  DEVICE_TYPES,
  GENERAL_FLAGS,
  INVASIVENESS,
  SPECIAL_FLAGS,
  COUNTRIES,
} from "@/eval/metadata";
import { isComplete, type ProductData } from "@/eval/state";
import { CERTITUDE_LABEL } from "@/cases/meta";
import { CERTAINTY_LABEL } from "@/eval/ResultCard";
import type { Case, Product } from "@/store/types";

export type HelenaExport = {
  generatedAt: string;
  product: { id: string; name: string; manufacturer: string };
  country: { code: string; label: string };
  classification: {
    deviceClass: string;
    certitude: string; // algoritmo vs. validada por humano
    algorithmCertainty: string; // certeza del algoritmo
    rulesVersion: string;
    appliedRules: string[];
  };
  authorization: string[];
  requirements: string[];
  // Atributos y flags relevantes (las respondidas "sí" / con valor).
  relevantFlags: { attribute: string; value: string }[];
  reviewNote?: string;
};

const enumLabel = <T extends string>(
  options: readonly { value: T; label: string }[],
  value: T | undefined,
) => (value === undefined ? "—" : options.find((o) => o.value === value)?.label ?? value);

const countryLabel = (code: string) =>
  COUNTRIES.find((c) => c.value === code)?.label ?? code.toUpperCase();

// Atributos base + flags respondidas en "sí": lo regulatoriamente relevante
// que se le presenta al ente. Las flags en "no" o sin responder se omiten.
function relevantFlags(data: ProductData): { attribute: string; value: string }[] {
  const rows: { attribute: string; value: string }[] = [
    { attribute: "Tipo de dispositivo", value: enumLabel(DEVICE_TYPES, data.device_type) },
    { attribute: "Invasividad", value: enumLabel(INVASIVENESS, data.invasiveness) },
    { attribute: "Zona del cuerpo", value: enumLabel(BODY_AREAS, data.contact_nature) },
    { attribute: "Duración de contacto", value: enumLabel(CONTACT_DURATIONS, data.contact_duration) },
    { attribute: "Dispositivo activo", value: data.is_active ? "Sí" : "No" },
  ];
  for (const f of SPECIAL_FLAGS)
    if (data.special[f.key] === true) rows.push({ attribute: f.label, value: "Sí" });
  for (const f of GENERAL_FLAGS)
    if (data.general[f.key] === true) rows.push({ attribute: f.label, value: "Sí" });
  return rows;
}

// Indica si un trámite puede exportarse: debe estar clasificado (validado)
// y el producto presente y completo (sin flags sin responder).
export function canExport(product: Product | undefined, case_: Case): boolean {
  return (
    case_.status === "classified" &&
    product !== undefined &&
    isComplete(product.data)
  );
}

export function buildHelenaDataset(product: Product, case_: Case): HelenaExport {
  const rules = case_.result.standards.slice(1); // standards[0] es la clase
  return {
    generatedAt: new Date().toISOString(),
    product: { id: product.id, name: product.name, manufacturer: product.manufacturer },
    country: { code: case_.country, label: countryLabel(case_.country) },
    classification: {
      deviceClass: case_.finalClass,
      certitude: CERTITUDE_LABEL[case_.certitude],
      algorithmCertainty: CERTAINTY_LABEL[case_.result.certainty],
      rulesVersion: case_.rulesVersion,
      appliedRules: rules,
    },
    authorization: case_.result.authorization,
    requirements: case_.result.requirements,
    relevantFlags: relevantFlags(product.data),
    reviewNote: case_.reviewNote,
  };
}

// ---- Descargas ------------------------------------------------------------

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "expediente";

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const baseName = (data: HelenaExport) =>
  `expediente-${slug(data.product.name)}-${data.country.code}`;

export function downloadHelenaJson(data: HelenaExport) {
  download(`${baseName(data)}.json`, JSON.stringify(data, null, 2), "application/json");
}

// CSV plano clave/valor: una fila por dato, con las listas numeradas. Es el
// formato más cómodo para pegar/cargar a mano en el sistema del ente.
export function downloadHelenaCsv(data: HelenaExport) {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows: [string, string][] = [
    ["Generado", data.generatedAt],
    ["Producto", data.product.name],
    ["ID producto", data.product.id],
    ["Fabricante/importador", data.product.manufacturer],
    ["País", data.country.label],
    ["Clase asignada", data.classification.deviceClass],
    ["Certitud", data.classification.certitude],
    ["Certeza del algoritmo", data.classification.algorithmCertainty],
    ["Versión de reglas", data.classification.rulesVersion],
  ];
  data.classification.appliedRules.forEach((r, i) => rows.push([`Regla aplicada ${i + 1}`, r]));
  data.authorization.forEach((a, i) => rows.push([`Autorización ${i + 1}`, a]));
  data.requirements.forEach((r, i) => rows.push([`Requisito ${i + 1}`, r]));
  data.relevantFlags.forEach((f) => rows.push([f.attribute, f.value]));
  if (data.reviewNote) rows.push(["Nota del staff", data.reviewNote]);

  const csv = ["Campo,Valor", ...rows.map(([k, v]) => `${esc(k)},${esc(v)}`)].join("\r\n");
  download(`${baseName(data)}.csv`, csv, "text/csv;charset=utf-8");
}
