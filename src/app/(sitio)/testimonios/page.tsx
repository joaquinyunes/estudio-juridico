import type { Metadata } from "next";
import Link from "next/link";
import { getAreas, getTestimonios } from "@/lib/cms";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { TestimonioCard } from "@/components/TestimonioCard";

export const metadata: Metadata = {
  title: "Casos resueltos",
  description:
    "Testimonios anonimizados de clientes del estudio, por tipo de caso y resultado obtenido.",
  alternates: { canonical: "/testimonios" },
};

export default async function TestimoniosPage() {
  const [testimonios, areas] = await Promise.all([getTestimonios(), getAreas()]);

  return (
    <>
      <CabeceraPagina
        rotulo="Casos resueltos"
        titulo={
          <>
            Sin nombres. <em>Con resultados.</em>
          </>
        }
        bajada="Por secreto profesional y ética de la abogacía, publicamos cada testimonio sin datos que permitan identificar a nuestros clientes."
      />

      {areas.map((area) => {
        const delArea = testimonios.filter((t) => t.areaSlug === area.slug);
        if (delArea.length === 0) return null;
        return (
          <section
            key={area.slug}
            aria-labelledby={`t-${area.slug}`}
            className="mx-auto max-w-[88rem] px-6 pb-20"
          >
            <div className="flex items-baseline justify-between gap-6 border-t border-tinta pt-6">
              <h2 id={`t-${area.slug}`} className="font-display text-3xl md:text-4xl">
                <span className="rotulo mr-4 align-middle text-lacre">{area.numero}</span>
                {area.nombre}
              </h2>
              <Link href={`/areas/${area.slug}`} className="enlace rotulo hidden shrink-0 sm:inline">
                Ver área →
              </Link>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {delArea.map((t) => (
                <TestimonioCard key={t.expediente} testimonio={t} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
