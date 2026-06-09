type HeroProps = {
  title: string;
  subtitle: string;
  /** Imagen de fondo del banner (import de asset). */
  image?: string;
  /** Posición del fondo, p.ej. "center", "center 30%". */
  position?: string;
  /** Clases tailwind de fondo si no hay imagen (gradiente de marca). */
  bg?: string;
};

// Banner superior que encabeza cada sección del sitio (foto + título centrado).
export function Hero({
  title,
  subtitle,
  image,
  position = "center",
  bg = "bg-gradient-to-br from-[var(--qk-navy)] via-[var(--qk-blue-dark)] to-[var(--qk-celeste)]",
}: HeroProps) {
  return (
    <section
      className={`relative overflow-hidden bg-cover ${image ? "" : bg}`}
      style={
        image
          ? { backgroundImage: `url(${image})`, backgroundPosition: position }
          : undefined
      }
    >
      {/* Velo para mejorar el contraste del texto sobre la imagen. */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative mx-auto flex min-h-[300px] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center md:min-h-[360px]">
        <h1 className="text-4xl font-semibold tracking-tight text-white drop-shadow-md md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-light text-white/90 drop-shadow md:text-xl">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
