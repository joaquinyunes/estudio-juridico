"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

/**
 * Barra fija inferior en celulares: consulta, calculadora y llamada a un toque
 * del pulgar. Respeta la zona segura del iPhone (barra de inicio).
 */
export function BarraMovil({ telefono }: { telefono: string }) {
  const pathname = usePathname();
  if (pathname.startsWith("/contacto")) return null;

  return (
    <nav
      aria-label="Acciones rápidas"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-linea bg-papel/95 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden"
    >
      <div className="grid grid-cols-[1fr_auto_auto] gap-2">
        <Link
          href="/contacto"
          className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-tinta px-5 text-sm font-medium text-papel"
        >
          Contanos tu caso <span aria-hidden>→</span>
        </Link>
        <Link
          href="/calculadora-indemnizacion"
          className="flex min-h-12 items-center justify-center rounded-full border border-tinta px-4 text-sm"
        >
          Calcular
        </Link>
        <a
          href={`tel:${telefono.replace(/[^\d+]/g, "")}`}
          onClick={() => trackEvent("llamada_click", { origen: "barra-movil" })}
          className="flex min-h-12 w-12 items-center justify-center rounded-full border border-tinta"
        >
          <span className="sr-only">Llamar al estudio</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
              d="M5 3.5h3.2l1.6 4.2-2 1.3a11 11 0 0 0 7.2 7.2l1.3-2 4.2 1.6V19a1.6 1.6 0 0 1-1.7 1.6A16.5 16.5 0 0 1 3.4 5.2 1.6 1.6 0 0 1 5 3.5Z"
            />
          </svg>
        </a>
      </div>
    </nav>
  );
}
