import type { Metadata } from "next";
import Link from "next/link";
import { faqsGenerales } from "@/lib/content";
import { getAreas } from "@/lib/cms";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { JsonLd } from "@/components/JsonLd";
import { buildFaqPageJsonLd } from "@/lib/schema-org";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas claras a las preguntas más comunes sobre despidos, divorcios, causas penales, sociedades y sucesiones.",
  alternates: { canonical: "/preguntas-frecuentes" },
};

export default async function PreguntasFrecuentesPage() {
  const areas = await getAreas();
  const todas = [...faqsGenerales, ...areas.flatMap((a) => a.faqs)];

  return (
    <>
      <JsonLd data={buildFaqPageJsonLd(todas)} />
      <CabeceraPagina
        rotulo="Preguntas frecuentes"
        titulo={
          <>
            Respuestas <em>sin vueltas.</em>
          </>
        }
        bajada="Lo que más nos preguntan, ordenado por área. Si tu duda no está acá, escribinos: la primera consulta no tiene costo."
      >
        <nav aria-label="Ir a un área" className="mt-10 flex flex-wrap gap-2">
          <a href="#generales" className="rounded-full border border-linea px-4 py-2 text-sm hover:border-tinta">
            Generales
          </a>
          {areas.map((a) => (
            <a
              key={a.slug}
              href={`#${a.slug}`}
              className="rounded-full border border-linea px-4 py-2 text-sm hover:border-tinta"
            >
              {a.nombre}
            </a>
          ))}
        </nav>
      </CabeceraPagina>

      <div className="mx-auto max-w-[88rem] space-y-20 px-6 pb-24">
        <section id="generales" aria-labelledby="t-generales" className="grid gap-8 lg:grid-cols-12">
          <h2 id="t-generales" className="font-display text-3xl lg:col-span-4">
            Generales
          </h2>
          <div className="lg:col-span-8">
            <FAQAccordion faqs={faqsGenerales} />
          </div>
        </section>
        {areas.map((area) => (
          <section key={area.slug} id={area.slug} aria-labelledby={`t-${area.slug}`} className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 id={`t-${area.slug}`} className="font-display text-3xl">
                {area.nombre}
              </h2>
              <Link href={`/areas/${area.slug}`} className="enlace rotulo mt-4 inline-block text-lacre">
                Ver el área →
              </Link>
            </div>
            <div className="lg:col-span-8">
              <FAQAccordion faqs={area.faqs} abrirPrimera={false} />
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
