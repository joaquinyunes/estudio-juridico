import type { Metadata } from "next";
import Link from "next/link";
import { getAreas, getEquipo } from "@/lib/cms";
import { buildEquipoJsonLd } from "@/lib/schema-org";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { TarjetaAbogado } from "@/components/TarjetaAbogado";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Equipo",
  description:
    "Conocé a los abogados del estudio: trayectoria, especialidades y matrículas del Colegio Público de la Abogacía.",
  alternates: { canonical: "/equipo" },
};

export default async function EquipoPage() {
  const [equipo, areas] = await Promise.all([getEquipo(), getAreas()]);
  const nombresDeAreas = Object.fromEntries(areas.map((a) => [a.slug, a.nombre]));
  const socios = equipo.filter((a) => a.socio);
  const asociados = equipo.filter((a) => !a.socio);

  return (
    <>
      <JsonLd data={buildEquipoJsonLd(equipo)} />
      <CabeceraPagina
        rotulo="Equipo"
        titulo={
          <>
            Siete abogados. <em>Un solo trato.</em>
          </>
        }
        bajada="Cada caso tiene un responsable con nombre y apellido, que lo lleva de principio a fin. Estas son las personas que vas a encontrar del otro lado."
      />

      <section aria-labelledby="t-socios" className="mx-auto max-w-[88rem] px-6 pb-20">
        <h2 id="t-socios" className="rotulo text-tinta-3">Socios</h2>
        <div className="mt-8 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {socios.map((a, i) => (
            <TarjetaAbogado key={a.slug} abogado={a} nombresDeAreas={nombresDeAreas} detalle prioridad={i < 2} />
          ))}
        </div>
      </section>

      <section aria-labelledby="t-asociados" className="mx-auto max-w-[88rem] px-6 pb-24">
        <h2 id="t-asociados" className="rotulo border-t border-linea pt-10 text-tinta-3">Asociados</h2>
        <div className="mt-8 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {asociados.map((a) => (
            <TarjetaAbogado key={a.slug} abogado={a} nombresDeAreas={nombresDeAreas} detalle />
          ))}
        </div>
      </section>

      <section className="bg-papel-2">
        <div className="mx-auto flex max-w-[88rem] flex-col items-start justify-between gap-8 px-6 py-20 md:flex-row md:items-end">
          <h2 className="display max-w-2xl text-[clamp(2.2rem,4.5vw,3.75rem)]">
            ¿Querés que alguien de este equipo <em>vea tu caso?</em>
          </h2>
          <Link
            href="/contacto"
            className="inline-flex shrink-0 items-center gap-3 rounded-full bg-tinta px-7 py-4 text-papel transition-colors hover:bg-lacre"
          >
            Contanos tu caso <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
