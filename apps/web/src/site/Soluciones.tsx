import { Factory, Globe, PackageCheck } from "lucide-react";

import { Hero } from "./Hero";
import solucionesHero from "@/assets/qetkra/soluciones-hero.avif";

const SOLUTIONS = [
  {
    icon: Factory,
    title: "Sistemas de Gestión",
    desc: "Realizamos auditorías y certificaciones ISO para cualquier sector y actividad. Lo ayudamos a comunicar a sus clientes su compromiso con la calidad y a preparar su empresa para nuevos desafíos.",
  },
  {
    icon: Globe,
    title: "Comercio Exterior",
    desc: "Ofrecemos una amplia gama de servicios para facilitar su acceso a los mercados internacionales: auditorías de planta, inspecciones pre-embarque y evaluación de proveedores donde su empresa lo necesite.",
  },
  {
    icon: PackageCheck,
    title: "Productos",
    desc: "Nos especializamos en gestionar procesos de certificación y homologación de productos ante ENACOM, ofreciendo un servicio integral a empresas fabricantes e importadoras.",
  },
];

export function Soluciones() {
  return (
    <>
      <Hero
        title="Soluciones"
        subtitle="Ofrecemos servicios integrales para que sus proyectos crezcan sin interrupciones."
        image={solucionesHero}
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {SOLUTIONS.map(({ icon: Icon, title, desc }) => (
            <article key={title} className="flex flex-col items-center text-center">
              <div className="flex h-44 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--qk-blue-soft)] to-[var(--qk-celeste)]/30">
                <Icon className="size-16 text-[var(--qk-blue)]" strokeWidth={1.3} />
              </div>
              <h2 className="mt-6 text-xl font-semibold text-[var(--qk-blue)]">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {desc}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
