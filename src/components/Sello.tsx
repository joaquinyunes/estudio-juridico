type Props = {
  className?: string;
  /** Anima el anillo de texto (se desactiva con prefers-reduced-motion). */
  animado?: boolean;
  texto?: string;
  marca: Marca;
};

/** Lo que el sello muestra del estudio (sale de `datosDelEstudio`). */
export type Marca = { nombre: string; monograma: string; fundacion: number; ciudad: string };

// Las coordenadas usan un viewBox de 400 para que el texto del SVG tenga un
// tamaño nominal legible (≥ 12 px) para herramientas de accesibilidad.

/** Sello de lacre: la marca del estudio. SVG puro, sin imágenes. */
export function Sello({
  className,
  animado = true,
  marca,
  texto = `${marca.nombre.toUpperCase()} · ABOGADOS · DESDE ${marca.fundacion} · ${marca.ciudad.toUpperCase()} · `,
}: Props) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label={`Sello de ${marca.nombre}, abogados desde ${marca.fundacion}`}
    >
      <defs>
        <path
          id="sello-circulo"
          d="M200,200 m-152,0 a152,152 0 1,1 304,0 a152,152 0 1,1 -304,0"
        />
      </defs>
      <circle cx="200" cy="200" r="196" fill="var(--color-lacre)" />
      <circle
        cx="200"
        cy="200"
        r="184"
        fill="none"
        stroke="var(--color-papel)"
        strokeOpacity=".35"
        strokeWidth="2"
      />
      <g className={animado ? "girar" : undefined} style={{ transformOrigin: "200px 200px" }}>
        <text
          fill="var(--color-papel)"
          fontFamily="var(--font-geist-mono), monospace"
          fontSize="22"
          letterSpacing="3.4"
        >
          <textPath href="#sello-circulo">{texto}</textPath>
        </text>
      </g>
      <circle
        cx="200"
        cy="200"
        r="116"
        fill="none"
        stroke="var(--color-papel)"
        strokeOpacity=".5"
        strokeWidth="2"
      />
      <text
        x="200"
        y="232"
        textAnchor="middle"
        fill="var(--color-papel)"
        fontFamily="var(--font-fraunces), Georgia, serif"
        fontSize="96"
        fontStyle="italic"
      >
        {marca.monograma}
      </text>
    </svg>
  );
}

/** Monograma compacto para el encabezado. */
export function Monograma({ className, iniciales }: { className?: string; iniciales: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden>
      <circle cx="48" cy="48" r="46" fill="var(--color-lacre)" />
      <circle cx="48" cy="48" r="38" fill="none" stroke="var(--color-papel)" strokeOpacity=".45" strokeWidth="2" />
      <text
        x="48"
        y="61"
        textAnchor="middle"
        fill="var(--color-papel)"
        fontFamily="var(--font-fraunces), Georgia, serif"
        fontSize="34"
        fontStyle="italic"
      >
        {iniciales}
      </text>
    </svg>
  );
}
