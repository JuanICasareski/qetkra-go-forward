import { useMemo, useState } from "react";
import { ArrowRight, Loader2, MailCheck, Send } from "lucide-react";

import evaluate from "rules/med/evaluate";
import type { EvaluationResult } from "rules/med";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { useEval } from "../eval/context";
import { BoolRow } from "../eval/fields";
import { COUNTRIES, GENERAL_FLAGS, SPECIAL_FLAGS } from "../eval/metadata";
import { ProductFields, TypeSpecificFields } from "../eval/sections";
import { buildFlags } from "../eval/state";

import { DocumentUploader, type UploadedDoc } from "./DocumentUploader";
import { QetkraNav } from "./QetkraNav";

const CERTAINTY_STYLE: Record<EvaluationResult["certainty"], string> = {
  certain:
    "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  inferred:
    "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  undetermined:
    "border-transparent bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

const CERTAINTY_LABEL: Record<EvaluationResult["certainty"], string> = {
  certain: "Certeza alta",
  inferred: "Inferido",
  undetermined: "Indeterminado",
};

type SubmitStatus = "idle" | "sending" | "sent";

// Encabezado numerado para cada paso del formulario.
function Step(props: {
  n: number;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-x-8 gap-y-4 border-t border-[var(--qk-line)] py-8 md:grid-cols-[260px_1fr]">
      <div className="flex gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--qk-navy)] text-xs font-semibold text-white">
          {props.n}
        </span>
        <div>
          <h2 className="text-base font-semibold text-[var(--qk-navy)]">
            {props.title}
          </h2>
          {props.desc && (
            <p className="mt-1 text-sm text-muted-foreground">{props.desc}</p>
          )}
        </div>
      </div>
      <div className="min-w-0">{props.children}</div>
    </section>
  );
}

// Campo de texto etiquetado para los datos de contacto.
function TextField(props: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={props.id} className="text-xs font-medium text-muted-foreground">
        {props.label}
      </Label>
      <Input
        id={props.id}
        type={props.type ?? "text"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className="h-10"
      />
    </div>
  );
}

function ResultList(props: { title: string; items: string[] }) {
  if (props.items.length === 0) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {props.title}
      </p>
      <ul className="space-y-1">
        {props.items.map((it, i) => (
          <li key={i} className="text-sm leading-snug text-foreground/90">
            • {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultCard(props: { label: string; result: EvaluationResult }) {
  const { result } = props;
  const deviceClass = result.standards[0] ?? "—";
  const rules = result.standards.slice(1);

  return (
    <div className="rounded-xl border border-[var(--qk-line)] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-[var(--qk-navy)]">
          {props.label}
        </h3>
        <Badge className={CERTAINTY_STYLE[result.certainty]}>
          {CERTAINTY_LABEL[result.certainty]}
        </Badge>
      </div>
      <div className="mt-3 rounded-lg bg-[var(--qk-blue-soft)] px-4 py-3">
        <p className="text-xs font-medium text-[var(--qk-blue-dark)]">
          Clase asignada
        </p>
        <p className="text-2xl font-bold tracking-tight text-[var(--qk-navy)]">
          {deviceClass}
        </p>
      </div>
      <div className="mt-3 space-y-3">
        <ResultList title="Reglas aplicadas" items={rules} />
        <Separator />
        <ResultList title="Autorización / vía" items={result.authorization} />
        <Separator />
        <ResultList title="Requisitos" items={result.requirements} />
      </div>
    </div>
  );
}

export function NewProduct() {
  const { state, set } = useEval();
  const [name, setName] = useState("");
  const [contact, setContact] = useState({
    responsible: "",
    email: "",
    company: "",
    phone: "",
  });
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const results = useMemo(() => {
    const flags = buildFlags(state);
    return COUNTRIES.filter((c) => state.countries[c.value]).map((c) => ({
      ...c,
      result: evaluate(c.value, flags),
    }));
  }, [state]);

  const setContactField = (k: keyof typeof contact, v: string) =>
    setContact((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = () => {
    if (status !== "idle") return;
    setStatus("sending");
    // Simulación de envío — no se persiste nada, es solo feedback visual.
    setTimeout(() => setStatus("sent"), 1800);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <QetkraNav />

      {/* Título */}
      <div id="trabaja" className="mx-auto max-w-6xl px-6 pt-12 pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--qk-navy)]">
          Certificá tu producto médico
        </h1>
        <p className="mt-2 max-w-xl text-base text-muted-foreground">
          Cargá los datos de tu producto y la documentación requerida. Te
          indicamos la clase regulatoria que le corresponde en cada mercado.
        </p>
      </div>

      {/* Formulario */}
      <main className="mx-auto max-w-6xl px-6 pb-20">
        <Step
          n={1}
          title="Datos del producto y contacto"
          desc="Identificá el producto y dejanos cómo comunicarnos con el responsable."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <TextField
                id="product-name"
                label="Nombre del producto"
                value={name}
                onChange={setName}
                placeholder="Ej. Monitor multiparamétrico XR-200"
              />
            </div>
            <TextField
              id="contact-responsible"
              label="Responsable"
              value={contact.responsible}
              onChange={(v) => setContactField("responsible", v)}
              placeholder="Nombre y apellido"
            />
            <TextField
              id="contact-company"
              label="Empresa"
              value={contact.company}
              onChange={(v) => setContactField("company", v)}
              placeholder="Razón social"
            />
            <TextField
              id="contact-email"
              label="Email del responsable"
              type="email"
              value={contact.email}
              onChange={(v) => setContactField("email", v)}
              placeholder="responsable@empresa.com"
            />
            <TextField
              id="contact-phone"
              label="Número de contacto"
              type="tel"
              value={contact.phone}
              onChange={(v) => setContactField("phone", v)}
              placeholder="+54 11 5555-5555"
            />
          </div>
        </Step>

        <Step
          n={2}
          title="Documentación requerida"
          desc="Subí todos los documentos que respaldan tu producto. No hay un mínimo: cargá los que necesites."
        >
          <DocumentUploader docs={docs} onChange={setDocs} />
        </Step>

        <Step
          n={3}
          title="Características del producto"
          desc="Definí los atributos y propiedades que determinan la clasificación."
        >
          <div className="space-y-6">
            <ProductFields />
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Específicos del tipo
              </p>
              <TypeSpecificFields />
            </div>
          </div>
        </Step>

        <Step
          n={4}
          title="Características regulatorias"
          desc="Activá las propiedades especiales y generales que apliquen."
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Especiales
              </p>
              <div className="divide-y">
                {SPECIAL_FLAGS.map((f) => (
                  <BoolRow
                    key={f.key}
                    label={f.label}
                    checked={state.special[f.key]}
                    onChange={(v) =>
                      set("special", { ...state.special, [f.key]: v })
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Generales
              </p>
              <div className="divide-y">
                {GENERAL_FLAGS.map((f) => (
                  <BoolRow
                    key={f.key}
                    label={f.label}
                    checked={state.general[f.key]}
                    onChange={(v) =>
                      set("general", { ...state.general, [f.key]: v })
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </Step>

        <Step
          n={5}
          title="Mercados de certificación"
          desc="Elegí en qué países querés certificar tu producto."
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {COUNTRIES.map((c) => {
              const active = state.countries[c.value];
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() =>
                    set("countries", {
                      ...state.countries,
                      [c.value]: !active,
                    })
                  }
                  className={[
                    "rounded-xl border px-4 py-3 text-left text-sm font-medium transition",
                    active
                      ? "border-[var(--qk-blue)] bg-[var(--qk-blue-soft)] text-[var(--qk-navy)]"
                      : "border-[var(--qk-line)] bg-white text-muted-foreground hover:border-[var(--qk-blue)]/50",
                  ].join(" ")}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </Step>

        {/* Resultado final */}
        <section className="mt-4 rounded-2xl border border-[var(--qk-line)] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-[var(--qk-navy)] text-white">
              <ArrowRight className="size-4.5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-[var(--qk-navy)]">
                Clasificación asignada
                {name.trim() && (
                  <span className="text-muted-foreground"> · {name.trim()}</span>
                )}
              </h2>
              <p className="text-sm text-muted-foreground">
                Según los mercados seleccionados.
              </p>
            </div>
          </div>

          <div className="mt-5">
            {results.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[var(--qk-line)] px-4 py-10 text-center text-sm text-muted-foreground">
                Seleccioná al menos un mercado para ver la clase asignada.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {results.map((r) => (
                  <ResultCard key={r.value} label={r.label} result={r.result} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Envío del producto */}
        <section className="mt-6">
          {status === "sent" ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <MailCheck className="size-6" />
              </span>
              <p className="text-lg font-semibold text-[var(--qk-navy)]">
                Tu producto fue enviado
              </p>
              <p className="max-w-md text-sm text-muted-foreground">
                En breves nos comunicaremos por mail
                {contact.email.trim() ? ` a ${contact.email.trim()}` : ""}.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === "sending"}
                className="inline-flex min-w-56 items-center justify-center gap-2 rounded-xl bg-[var(--qk-navy)] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--qk-blue)] disabled:cursor-not-allowed disabled:opacity-80"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Enviando…
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Enviar producto
                  </>
                )}
              </button>
              <p className="text-xs text-muted-foreground">
                Revisaremos tu producto y te contactaremos por mail.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[var(--qk-line)] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Qetkra · Safety that inspires</span>
          <span>Módulo de aprobaciones médicas · AR · UE · US</span>
        </div>
      </footer>
    </div>
  );
}
