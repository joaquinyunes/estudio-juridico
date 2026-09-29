"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { AreaDePractica } from "@/lib/content";

type Props = {
  areas: Pick<AreaDePractica, "slug" | "numero" | "nombre" | "descripcionCorta" | "imagen" | "imagenAlt">[];
};

/**
 * Índice editorial de áreas. En escritorio, al pasar el mouse aparece la foto
 * del área en un marco en arco que sigue al cursor; en celular, cada fila
 * muestra su miniatura.
 */
export function ListaAreas({ areas }: Props) {
  const [activa, setActiva] = useState<number | null>(null);
  const contenedor = useRef<HTMLDivElement>(null);
  const flotante = useRef<HTMLDivElement>(null);

  const mover = (e: React.PointerEvent) => {
    const caja = contenedor.current?.getBoundingClientRect();
    if (!caja || !flotante.current) return;
    const x = e.clientX - caja.left;
    const y = e.clientY - caja.top;
    flotante.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
  };

  return (
    <div
      ref={contenedor}
      className="relative"
      onPointerMove={mover}
      onPointerLeave={() => setActiva(null)}
    >
      <ol className="border-t border-tinta">
        {areas.map((area, i) => (
          <li key={area.slug} className="border-b border-linea">
            <Link
              href={`/areas/${area.slug}`}
              onPointerEnter={() => setActiva(i)}
              onFocus={() => setActiva(i)}
              onBlur={() => setActiva(null)}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-7 md:grid-cols-12 md:gap-6 md:py-9"
            >
              <span className="rotulo text-lacre md:col-span-1">{area.numero}</span>
              <span className="md:col-span-5">
                <span className="block font-display text-[clamp(1.9rem,4.2vw,3.6rem)] leading-none tracking-tight transition-[transform,color] duration-500 ease-[var(--ease-folio)] group-hover:translate-x-3 group-hover:text-lacre">
                  {area.nombre}
                </span>
              </span>
              <span className="relative block h-16 w-12 shrink-0 overflow-hidden rounded-t-full md:hidden">
                <Image src={area.imagen} alt="" fill sizes="48px" className="foto object-cover" />
              </span>
              <span className="col-span-3 text-tinta-2 md:col-span-5 md:text-[1.05rem]">
                {area.descripcionCorta}
              </span>
              <span
                aria-hidden
                className="hidden h-12 w-12 items-center justify-center justify-self-end rounded-full border border-linea text-lg transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-lacre group-hover:bg-lacre group-hover:text-papel md:col-span-1 md:flex"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div
        ref={flotante}
        aria-hidden
        className={`pointer-events-none absolute top-0 left-0 z-10 hidden h-80 w-60 transition-opacity duration-300 lg:block ${
          activa === null ? "opacity-0" : "opacity-100"
        }`}
      >
        {areas.map((area, i) => (
          <div
            key={area.slug}
            className={`arco absolute inset-0 transition-[opacity,transform] duration-500 ease-[var(--ease-folio)] ${
              activa === i ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          >
            <Image src={area.imagen} alt="" fill sizes="240px" className="foto object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
