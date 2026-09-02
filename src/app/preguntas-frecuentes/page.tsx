import type { Metadata } from "next";
import Link from "next/link";
import { areasDePractica } from "@/lib/content";
import { FAQAccordion } from "@/components/FAQAccordion";
import { buildFaqPageJsonLd } from "@/lib/schema-org";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Respuestas por especialidad a las preguntas más comunes.",
};

export default function PreguntasFrecuentesPage() {
  const todasLasFaqs = areasDePractica.flatMap((area) => area.faqs);
  const faqJsonLd = buildFaqPageJsonLd(todasLasFaqs);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <h1 className="font-serif text-3xl font-semibold text-slate-900">
        Preguntas frecuentes
      </h1>
      <p className="mt-4 text-slate-600">
        Elegí tu área para ver las preguntas específicas, o revisá el resumen
        general acá abajo.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {areasDePractica.map((area) => (
          <Link
            key={area.slug}
            href={`/areas/${area.slug}`}
            className="text-sm rounded-full border border-slate-300 px-3 py-1 hover:border-slate-500"
          >
            {area.nombre}
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <FAQAccordion faqs={todasLasFaqs} />
      </section>
    </div>
  );
}
