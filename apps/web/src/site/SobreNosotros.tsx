import { Hero } from "./Hero";
import nosotrosHero from "@/assets/qetkra/nosotros-hero.avif";
import oaaLogo from "@/assets/qetkra/oaa.png";

const PARAGRAPHS = [
  "Cada vez que emitimos un certificado de calidad, evaluamos el contenido de un embarque que va a cruzar el mar, garantizamos la inocuidad de un producto, damos nuestra conformidad en un proceso, o cualquiera de las formas por las que responsablemente adjudicamos nuestro Sello Q, tenemos la satisfacción de estar construyendo un mundo más seguro.",
  "Porque en un mundo tan incierto, certificar es el modo en el que las empresas dicen a los consumidores que pueden confiar. Y la confianza de los consumidores impacta en los resultados de las empresas.",
  "Somos un equipo de profesionales con más de 20 años en el mundo de la seguridad. Porque estamos convencidos de que a través de la seguridad, creamos valor.",
];

export function SobreNosotros() {
  return (
    <>
      <Hero
        title="Sobre Nosotros"
        subtitle="Ofrecemos soluciones para la seguridad."
        image={nosotrosHero}
        position="center 60%"
      />

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="space-y-8">
          {PARAGRAPHS.map((p, i) => (
            <p
              key={i}
              className="text-base leading-relaxed text-[var(--qk-navy)]/60"
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Banda de acreditación OAA */}
      <section className="bg-[var(--qk-blue-dark)]">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-14 text-center">
          <div className="rounded-md bg-white px-5 py-4 shadow-sm">
            <img src={oaaLogo} alt="Organismo Argentino de Acreditación (OAA)" className="h-20 w-auto" />
          </div>
          <p className="max-w-2xl text-sm font-semibold leading-relaxed text-white">
            Somos un Organismo de Certificación de Productos acreditado por el
            Organismo Argentino de Acreditación (OAA). Ver alcance acreditado en{" "}
            <a
              href="https://www.oaa.org.ar"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-[var(--qk-celeste)]"
            >
              www.oaa.org.ar
            </a>
            . Más Info
          </p>
        </div>
      </section>
    </>
  );
}
