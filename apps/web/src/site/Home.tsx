import { Link } from "react-router";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";

import { Hero } from "./Hero";
import homeHero from "@/assets/qetkra/home-hero.jpg";

const HIGHLIGHTS = [
  {
    title: "Sistemas de Gestión",
    desc: "Auditorías y certificaciones ISO para cualquier sector y actividad.",
    to: "/soluciones",
  },
  {
    title: "Comercio Exterior",
    desc: "Servicios para facilitar su acceso a los mercados internacionales.",
    to: "/soluciones",
  },
  {
    title: "Productos",
    desc: "Certificación y homologación de productos ante los organismos.",
    to: "/soluciones",
  },
];

export function Home() {
  return (
    <>
      <Hero
        title="Safety that inspires"
        subtitle="Certificamos la calidad y la seguridad de sus productos y procesos."
        image={homeHero}
        position="center 70%"
      />

      {/* Bienvenida */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--qk-navy)] md:text-4xl">
            Bienvenidos a Qetkra
          </h2>
          <span className="flex size-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
            <MessageCircle className="size-6" />
          </span>
        </div>
        <p className="text-lg leading-relaxed text-[var(--qk-navy)]/60">
          Ayudamos a nuestros clientes a garantizar la calidad y la seguridad de
          sus productos y procesos. Gracias a este esfuerzo conjunto,
          transformamos el mundo en un lugar más seguro.
        </p>
      </section>

      {/* Accesos a soluciones */}
      <section className="border-t border-[var(--qk-line)] bg-[var(--qk-blue-soft)]/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {HIGHLIGHTS.map((h) => (
              <Link
                key={h.title}
                to={h.to}
                className="group rounded-2xl border border-[var(--qk-line)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--qk-blue-soft)] text-[var(--qk-blue)]">
                  <ShieldCheck className="size-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--qk-navy)]">
                  {h.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {h.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--qk-blue)]">
                  Conocer más
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-br from-[var(--qk-navy)] to-[var(--qk-blue-dark)] px-8 py-14 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            ¿Listo para certificar tu producto?
          </h2>
          <p className="max-w-xl text-white/80">
            Cargá los datos de tu producto y te indicamos la clase regulatoria
            que le corresponde en cada mercado.
          </p>
          <Link
            to="/trabaja"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[var(--qk-navy)] transition hover:bg-[var(--qk-blue-soft)]"
          >
            Trabajá con nosotros
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
