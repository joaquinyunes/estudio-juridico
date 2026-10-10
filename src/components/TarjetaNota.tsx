import Image from "next/image";
import Link from "next/link";
import type { Nota } from "@/lib/content";

export const formatoFecha = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const fechaCorta = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "20 nov 2025": para columnas angostas en celulares. */
function formatoCorto(fecha: Date) {
  return fechaCorta
    .formatToParts(fecha)
    .filter((p) => p.type !== "literal")
    .map((p) => p.value.replace(".", ""))
    .join(" ");
}

type Props = {
  nota: Nota;
  variante?: "destacada" | "normal" | "horizontal";
};

export function TarjetaNota({ nota, variante = "normal" }: Props) {
  const destacada = variante === "destacada";
  const horizontal = variante === "horizontal";

  return (
    <article
      className={`group relative ${horizontal ? "grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6" : "flex flex-col"}`}
    >
      <div
        className={`brillo relative bg-papel-3 ${
          destacada ? "aspect-[4/3]" : horizontal ? "aspect-[4/5] sm:aspect-[4/3]" : "aspect-[3/2]"
        }`}
      >
        <Image
          src={nota.imagen}
          alt={nota.imagenAlt}
          fill
          sizes={destacada ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 20vw, 40vw"}
          className="foto foto-vivo foto-zoom object-cover"
        />
      </div>
      <div className={horizontal ? "flex flex-col" : ""}>
        <p className={`rotulo flex flex-wrap gap-x-3 gap-y-1.5 text-tinta-3 ${horizontal ? "" : "mt-5"}`}>
          <span className="text-lacre">{nota.categoria}</span>
          <time dateTime={nota.fecha} className={horizontal ? "" : "whitespace-nowrap"}>
            {horizontal ? formatoCorto(new Date(nota.fecha)) : formatoFecha.format(new Date(nota.fecha))}
          </time>
          <span className="whitespace-nowrap">{nota.lectura}</span>
        </p>
        <h3 className={`mt-3 font-display leading-[1.1] ${destacada ? "text-4xl" : "text-2xl"}`}>
          <Link href={`/notas/${nota.slug}`} className="after:absolute after:inset-0">
            <span className="enlace">{nota.titulo}</span>
          </Link>
        </h3>
        <p className={`mt-3 leading-relaxed text-tinta-2 ${horizontal ? "hidden sm:block" : ""}`}>
          {nota.bajada}
        </p>
        <p className="mt-4 text-sm text-tinta-3">Por {nota.autor}</p>
      </div>
    </article>
  );
}
