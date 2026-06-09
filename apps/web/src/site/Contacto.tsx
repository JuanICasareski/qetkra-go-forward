import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone, UserRound } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import contactoHero from "@/assets/qetkra/contacto-hero.avif";

const CONTACT_ROWS = [
  { icon: Phone, label: "+54 11 5239 5077" },
  { icon: MessageCircle, label: "Whatsapp", accent: "text-emerald-500" },
  { icon: Mail, label: "info@qetkra.com" },
  {
    icon: MapPin,
    label:
      "Edificio SAFICO, Av. Corrientes 456, Piso 22. Ciudad Autónoma de Buenos Aires, Argentina, C1043AAR",
  },
];

function Field(props: {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={props.id} className="text-sm text-amber-700/90">
        {props.label} {props.required && <span>*</span>}
      </Label>
      <Input
        id={props.id}
        type={props.type ?? "text"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="h-10 bg-zinc-100"
      />
    </div>
  );
}

export function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [sent, setSent] = useState(false);

  const setField = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <>
      <div
        className="relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${contactoHero})` }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative mx-auto flex min-h-[300px] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white drop-shadow-sm md:text-5xl">
            Contáctenos
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-light text-white/90 drop-shadow-sm md:text-xl">
            Nuestros expertos pueden responder a sus preguntas.
          </p>
          <button
            type="button"
            className="mt-8 rounded bg-[var(--qk-navy)]/85 px-10 py-3 text-sm font-medium text-white transition hover:bg-[var(--qk-navy)]"
          >
            Suscribirse al newsletter
          </button>
        </div>
      </div>

      {/* Datos de contacto + mapa */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          <ul className="space-y-8">
            {CONTACT_ROWS.map((row, i) => {
              const Icon = row.icon;
              return (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--qk-blue-soft)] ${
                      row.accent ?? "text-[var(--qk-navy)]"
                    }`}
                  >
                    <Icon className="size-4.5" />
                  </span>
                  <span className="text-sm leading-relaxed text-[var(--qk-navy)]/80">
                    {row.label}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Mapa (embed de Google Maps) */}
          <div className="overflow-hidden rounded-xl border border-[var(--qk-line)] shadow-sm">
            <iframe
              title="Ubicación Qetkra"
              src="https://maps.google.com/maps?q=Av.%20Corrientes%20456,%20Buenos%20Aires&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="h-full min-h-[300px] w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section className="bg-zinc-400/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-sm md:p-10">
            <div className="grid gap-8 md:grid-cols-[200px_1fr]">
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <span className="flex size-16 items-center justify-center rounded-full bg-[var(--qk-navy)] text-white">
                  <UserRound className="size-8" />
                </span>
                <p className="mt-4 text-sm font-medium text-[var(--qk-navy)]/70">
                  O completá el formulario y nos contactaremos a la brevedad.
                </p>
              </div>

              {sent ? (
                <div className="flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 p-8 text-center text-sm font-medium text-[var(--qk-navy)]">
                  ¡Gracias! Recibimos tu mensaje y te contactaremos a la brevedad.
                </div>
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <Field
                    id="c-nombre"
                    label="Nombre"
                    value={form.nombre}
                    onChange={(v) => setField("nombre", v)}
                  />
                  <Field
                    id="c-email"
                    label="Email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(v) => setField("email", v)}
                  />
                  <Field
                    id="c-telefono"
                    label="Teléfono"
                    type="tel"
                    value={form.telefono}
                    onChange={(v) => setField("telefono", v)}
                  />
                  <Field
                    id="c-asunto"
                    label="Asunto"
                    value={form.asunto}
                    onChange={(v) => setField("asunto", v)}
                  />
                  <div className="space-y-1.5">
                    <Label htmlFor="c-mensaje" className="text-sm text-amber-700/90">
                      Mensaje
                    </Label>
                    <Textarea
                      id="c-mensaje"
                      value={form.mensaje}
                      onChange={(e) => setField("mensaje", e.target.value)}
                      className="min-h-32 bg-zinc-100"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="rounded bg-[var(--qk-blue-dark)] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--qk-blue)]"
                    >
                      Enviar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
