"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Mapa de Google Maps que se carga recién al hacer clic: evita ~450 KB de
 * terceros en la carga inicial y no deja cookies de Google hasta que el
 * visitante lo pide.
 */
export function MapaOficina({ direccion }: { direccion: string }) {
  const [activo, setActivo] = useState(false);
  const q = encodeURIComponent(direccion);

  return (
    <div className="relative aspect-[16/9] overflow-hidden border border-linea bg-papel-3 md:aspect-[21/8]">
      {activo ? (
        <iframe
          title={`Mapa: ${direccion}`}
          src={`https://maps.google.com/maps?q=${q}&z=16&output=embed`}
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full grayscale-[0.9] sepia-[0.15]"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActivo(true)}
          className="group absolute inset-0 flex h-full w-full items-center justify-center"
        >
          <Image
            src="/img/obelisco.jpg"
            alt=""
            fill
            sizes="100vw"
            className="foto object-cover opacity-60 transition-opacity group-hover:opacity-75"
          />
          <span className="relative rounded-full bg-tinta px-6 py-3 text-papel transition-colors group-hover:bg-lacre">
            Ver mapa interactivo
          </span>
        </button>
      )}
    </div>
  );
}
