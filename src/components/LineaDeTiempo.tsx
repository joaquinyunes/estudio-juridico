import Image from "next/image";
import type { Hito } from "@/lib/content";

/** Historia del estudio como una fila deslizable de "folios". */
export function LineaDeTiempo({ hitos }: { hitos: Hito[] }) {
  return (
    <div className="relative">
      <ol
        className="scrollbar-fina flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8 md:gap-10"
        aria-label="Historia del estudio"
        tabIndex={0}
      >
        {hitos.map((hito, i) => (
          <li
            key={hito.anio}
            className="w-[82vw] max-w-[26rem] shrink-0 snap-start first:ml-6 last:mr-6 md:first:ml-[max(1.5rem,calc((100vw-88rem)/2+1.5rem))]"
          >
            <article className="group flex h-full flex-col">
              <div className="flex items-end justify-between border-b border-papel/25 pb-3">
                <span className="display text-[5.5rem] leading-[0.8] text-papel transition-colors duration-500 group-hover:text-lacre-claro md:text-[7rem]">
                  {hito.anio}
                </span>
                <span className="rotulo text-papel/60">
                  {String(i + 1).padStart(2, "0")}/{String(hitos.length).padStart(2, "0")}
                </span>
              </div>
              <div className="brillo relative mt-6 aspect-[4/3]">
                <Image
                  src={hito.imagen}
                  alt={hito.imagenAlt}
                  fill
                  sizes="(min-width: 768px) 26rem, 82vw"
                  className="foto foto-vivo foto-zoom object-cover opacity-90 transition-opacity group-hover:opacity-100"
                />
              </div>
              <h3 className="mt-6 font-display text-2xl leading-tight text-papel">{hito.titulo}</h3>
              <p className="mt-3 leading-relaxed text-papel/65">{hito.texto}</p>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
