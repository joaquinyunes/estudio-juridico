import type { Testimonio } from "@/lib/content";

/** Testimonio anonimizado presentado como carátula de expediente. */
export function TestimonioCard({ testimonio, className = "" }: { testimonio: Testimonio; className?: string }) {
  return (
    <figure className={`group relative pt-7 ${className}`}>
      {/* Solapa de la carpeta */}
      <div
        aria-hidden
        className="absolute top-0 left-0 h-8 w-40 rounded-t-md bg-papel-3 transition-transform duration-500 ease-[var(--ease-folio)] [clip-path:polygon(0_0,85%_0,100%_100%,0_100%)] group-hover:-translate-y-2"
      />
      <div className="relative flex h-full flex-col rounded-tr-md rounded-b-md bg-papel-3 p-7 transition-[transform,box-shadow] duration-500 ease-[var(--ease-folio)] group-hover:-translate-y-2 group-hover:shadow-[0_24px_40px_-24px_rgb(23_21_15/0.45)] md:p-8">
        <div className="flex items-start justify-between gap-4">
          <p className="rotulo text-tinta-3">
            Exp. N° {testimonio.expediente}
          </p>
          <span
            aria-hidden
            className="sellar rotulo -mt-2 rotate-[-8deg] rounded-sm border-2 border-lacre px-2 py-1.5 !text-[0.68rem] font-semibold text-lacre"
          >
            Resuelto
          </span>
        </div>
        <p className="mt-3 text-sm font-medium">{testimonio.tipoDeCaso}</p>
        <blockquote className="mt-6 flex-1 font-display text-[1.45rem] leading-snug tracking-tight">
          <span className="text-lacre">“</span>
          {testimonio.texto}
          <span className="text-lacre">”</span>
        </blockquote>
        <figcaption className="mt-8 flex items-baseline justify-between gap-4 border-t border-tinta/15 pt-4 text-sm">
          <span className="text-tinta-2">{testimonio.resultado}</span>
          <span className="rotulo shrink-0 text-tinta-3">{testimonio.anio}</span>
        </figcaption>
      </div>
    </figure>
  );
}
