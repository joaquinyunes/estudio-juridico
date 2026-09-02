import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  areasDePractica,
  getAreaBySlug,
  getTestimoniosByAreaSlug,
} from "@/lib/content";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildLegalServiceJsonLd,
} from "@/lib/schema-org";
import { FAQAccordion } from "@/components/FAQAccordion";
import { TestimonioCard } from "@/components/TestimonioCard";
import { FormularioCalificador } from "@/components/FormularioCalificador";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return areasDePractica.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) return {};

  return {
    title: area.nombre,
    description: area.descripcionCorta,
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) notFound();

  const testimoniosDelArea = getTestimoniosByAreaSlug(area.slug);

  const legalServiceJsonLd = buildLegalServiceJsonLd(area);
  const faqJsonLd = buildFaqPageJsonLd(area.faqs);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: "/" },
    { name: area.nombre, url: `/areas/${area.slug}` },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <h1 className="font-serif text-3xl font-semibold text-slate-900">
        {area.nombre}
      </h1>
      <p className="mt-4 text-lg text-slate-600">{area.descripcionLarga}</p>

      <ul className="mt-8 space-y-2">
        {area.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2 text-slate-700">
            <span aria-hidden className="text-emerald-700">
              ✓
            </span>
            {bullet}
          </li>
        ))}
      </ul>

      {testimoniosDelArea.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-slate-900 mb-4">
            Casos resueltos
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {testimoniosDelArea.map((testimonio) => (
              <TestimonioCard key={testimonio.texto} testimonio={testimonio} />
            ))}
          </div>
        </section>
      )}

      {area.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-slate-900 mb-4">
            Preguntas frecuentes
          </h2>
          <FAQAccordion faqs={area.faqs} />
        </section>
      )}

      <section className="mt-12 rounded-lg border border-slate-200 p-6">
        <h2 className="font-serif text-xl font-semibold text-slate-900 mb-4">
          Contanos tu caso
        </h2>
        <FormularioCalificador areaPreseleccionada={area.slug} />
      </section>
    </div>
  );
}
