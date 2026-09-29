"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Barra fija inferior en celulares: el CTA principal siempre a un toque. */
export function BarraMovil() {
  const pathname = usePathname();
  if (pathname.startsWith("/contacto") || pathname.startsWith("/studio")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-papel/95 p-3 backdrop-blur-md sm:hidden">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Link
          href="/contacto"
          className="flex items-center justify-center gap-2 rounded-full bg-tinta px-5 py-3.5 text-sm font-medium text-papel"
        >
          Contanos tu caso <span aria-hidden>→</span>
        </Link>
        <Link
          href="/calculadora-indemnizacion"
          className="flex items-center justify-center rounded-full border border-tinta px-4 py-3.5 text-sm"
        >
          Calcular
        </Link>
      </div>
    </div>
  );
}
