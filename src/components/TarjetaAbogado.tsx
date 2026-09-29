import Image from "next/image";
import type { Abogado } from "@/lib/content";

type Props = {
  abogado: Abogado;
  nombresDeAreas: Record<string, string>;
  detalle?: boolean;
  prioridad?: boolean;
};

export function TarjetaAbogado({ abogado, nombresDeAreas, detalle = false, prioridad = false }: Props) {
  return (
    <article className="group" id={abogado.slug}>
      <div className="arco relative aspect-[3/4] bg-papel-3">
        <Image
          src={abogado.foto}
          alt={`Retrato de ${abogado.nombre}`}
          fill
          loading={prioridad ? "eager" : "lazy"}
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
          className="foto foto-vivo object-cover object-top group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-5 border-t border-tinta pt-4">
        <p className="rotulo text-lacre">{abogado.cargo}</p>
        <h3 className="mt-2 font-display text-2xl leading-tight">{abogado.nombre}</h3>
        <p className="mt-1 text-sm text-tinta-3">
          {abogado.areas.map((a) => nombresDeAreas[a] ?? a).join(" · ")}
        </p>
        {detalle && (
          <>
            <p className="mt-4 leading-relaxed text-tinta-2">{abogado.bio}</p>
            <p className="mt-4 text-sm text-tinta-3">{abogado.formacion}</p>
          </>
        )}
        <p className="rotulo mt-4 !text-[0.68rem] text-tinta-3">{abogado.matricula}</p>
      </div>
    </article>
  );
}
