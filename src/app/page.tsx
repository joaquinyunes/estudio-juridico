import Link from "next/link";
import { areasDePractica, datosDelEstudio } from "@/lib/content";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";

export default function HomePage() {
  return (
    <div>
      <section className="bg-navy">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <span aria-hidden className="block h-1 w-16 bg-gold mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white max-w-3xl">
            Asesoramiento legal claro, sin vueltas y sin sorpresas en el costo.
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl">
            Contanos tu caso por área de especialidad y te respondemos si conviene
            avanzar y qué podés esperar — antes de cualquier compromiso.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 text-navy font-semibold hover:bg-gold-light transition-colors"
            >
              Contanos tu caso
            </Link>
            <WhatsAppCTA mensaje="Hola, quiero hacer una consulta general.">
              Escribir por WhatsApp
            </WhatsAppCTA>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 border-t border-slate-100">
        <h2 className="font-serif text-2xl font-semibold text-navy mb-8">
          Áreas de práctica
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areasDePractica.map((area) => (
            <Link
              key={area.slug}
              href={`/areas/${area.slug}`}
              className="group rounded-lg border border-slate-200 p-6 hover:border-gold hover:shadow-md transition-all"
            >
              <h3 className="font-serif text-lg font-semibold text-navy group-hover:text-gold transition-colors">
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
        <h2 className="font-serif text-2xl font-semibold text-navy mb-4">
          {datosDelEstudio.nombre}
        </h2>
        <p className="text-slate-600">
          {datosDelEstudio.direccion} · {datosDelEstudio.horarios}
        </p>
      </section>
    </div>
  );
}
