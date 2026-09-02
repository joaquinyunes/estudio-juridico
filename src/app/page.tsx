import Link from "next/link";
import { areasDePractica, datosDelEstudio } from "@/lib/content";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-slate-900 max-w-3xl">
          Asesoramiento legal claro, sin vueltas y sin sorpresas en el costo.
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl">
          Contanos tu caso por área de especialidad y te respondemos si conviene
          avanzar y qué podés esperar — antes de cualquier compromiso.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            Contanos tu caso
          </Link>
          <WhatsAppCTA mensaje="Hola, quiero hacer una consulta general.">
            Escribir por WhatsApp
          </WhatsAppCTA>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 border-t border-slate-100">
        <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-8">
          Áreas de práctica
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areasDePractica.map((area) => (
            <Link
              key={area.slug}
              href={`/areas/${area.slug}`}
              className="rounded-lg border border-slate-200 p-6 hover:border-slate-400 hover:shadow-sm transition-all"
            >
              <h3 className="font-serif text-lg font-semibold text-slate-900">
                {area.nombre}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {area.descripcionCorta}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 border-t border-slate-100">
        <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
          {datosDelEstudio.nombre}
        </h2>
        <p className="text-slate-600">
          {datosDelEstudio.direccion} · {datosDelEstudio.horarios}
        </p>
      </section>
    </div>
  );
}
