import Link from "next/link";
import type { Aviso } from "@/lib/cms";

/** Cinta superior con la novedad del mes. El estudio la edita desde el panel. */
export function AvisoDelSitio({ aviso }: { aviso: Aviso }) {
  const externo = aviso.enlace?.startsWith("http");

  return (
    <aside aria-label="Aviso del estudio" className="aviso relative overflow-hidden bg-lacre text-papel">
      <div className="mx-auto flex max-w-[88rem] flex-wrap items-center justify-center gap-x-4 gap-y-1 px-6 py-2.5 text-center text-sm">
        <span className="rotulo rounded-full border border-papel/50 px-2.5 py-1.5 !text-[0.65rem]">
          {aviso.etiqueta}
        </span>
        <p className="text-balance">{aviso.texto}</p>
        {aviso.enlace &&
          (externo ? (
            <a
              href={aviso.enlace}
              target="_blank"
              rel="noopener noreferrer"
              className="enlace rotulo !text-[0.7rem] font-semibold whitespace-nowrap"
            >
              {aviso.enlaceTexto} →
            </a>
          ) : (
            <Link href={aviso.enlace} className="enlace rotulo !text-[0.7rem] font-semibold whitespace-nowrap">
              {aviso.enlaceTexto} →
            </Link>
          ))}
      </div>
    </aside>
  );
}
