import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArea, getAreas, getDatosDelEstudio, getEquipo, getTestimoniosDeArea } from "@/lib/cms";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildLegalServiceJsonLd,
} from "@/lib/schema-org";
import { FAQAccordion } from "@/components/FAQAccordion";
import { TestimonioCard } from "@/components/TestimonioCard";
import { FormularioCalificador } from "@/components/FormularioCalificador";
import { CalculadoraDespido } from "@/components/CalculadoraDespido";
import { TarjetaAbogado } from "@/components/TarjetaAbogado";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return (await getAreas()).map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const area = await getArea(slug);
  if (!area) return {};
  return {
    title: `${area.nombre} en Buenos Aires`,
    description: area.descripcionCorta,
    alternates: { canonical: `/areas/${area.slug}` },
    openGraph: { title: `${area.nombre} — ${area.titular}`, description: area.descripcionCorta },
  };
}

const INCISOS = "abcdefghij";

export default async function AreaPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [area, areas, datos, equipo] = await Promise.all([
    getArea(slug),
    getAreas(),
    getDatosDelEstudio(),
    getEquipo(),
  ]);
  if (!area) notFound();

  const testimonios = await getTestimoniosDeArea(area.slug);
  const responsables = equipo.filter((a) => a.areas.includes(area.slug));
  const nombresDeAreas = Object.fromEntries(areas.map((a) => [a.slug, a.nombre]));
  const otras = areas.filter((a) => a.slug !== area.slug);
  const esPenal = area.slug === "penal";

  return (
    <>
      <JsonLd data={buildLegalServiceJsonLd(area, datos)} />
      <JsonLd data={buildFaqPageJsonLd(area.faqs)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Áreas", url: "/#areas" },
          { name: area.nombre, url: `/areas/${area.slug}` },
        ])}
      />

      <section className="mx-auto max-w-[88rem] px-6 pt-8 pb-20 md:pt-12 md:pb-28">
        <nav aria-label="Ruta de navegación" className="rotulo text-tinta-3">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="enlace">Inicio</Link> /
            </li>
            <li>
              <Link href="/#areas" className="enlace">Áreas</Link> /
            </li>
            <li aria-current="page" className="text-lacre">{area.nombre}</li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="rotulo text-lacre">
              Área {area.numero} <span className="text-tinta-3">— {area.nombre}</span>
            </p>
            <h1 className="display mt-6 text-[clamp(3rem,7.5vw,7rem)]">
              {area.titular.split(". ").map((frase, i, arr) => (
                <span key={frase} className="linea-titular">
                  <span style={{ animationDelay: `${100 + i * 120}ms` }}>
                    {i === arr.length - 1 && arr.length > 1 ? <em>{frase}</em> : `${frase}${i < arr.length - 1 ? "." : ""}`}
                  </span>
                </span>
              ))}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-tinta-2 md:text-xl">
              {area.descripcionLarga}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#consulta"
                className="inline-flex items-center gap-3 rounded-full bg-tinta px-7 py-4 text-papel transition-colors hover:bg-lacre"
              >
                Contanos tu caso <span aria-hidden>→</span>
              </Link>
              {esPenal ? (
                <WhatsAppCTA
                  mensaje="URGENTE — Necesito asistencia penal ahora."
                  origen="area-penal"
                  className="inline-flex items-center gap-2 rounded-full border border-lacre px-7 py-4 text-lacre transition-colors hover:bg-lacre hover:text-papel"
                >
                  Guardia 24 h — urgencias
                </WhatsAppCTA>
              ) : area.slug === "laboral" ? (
                <Link
                  href="#calculadora"
                  className="inline-flex items-center gap-2 rounded-full border border-tinta px-7 py-4 transition-colors hover:bg-tinta hover:text-papel"
                >
                  Calcular mi indemnización
                </Link>
              ) : null}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="arco relative aspect-[4/5] bg-papel-3">
              <Image
                src={area.imagen}
                alt={area.imagenAlt}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="foto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="t-resolvemos" className="border-y border-tinta bg-papel-2">
        <div className="mx-auto grid max-w-[88rem] gap-10 px-6 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="rotulo text-lacre">§ 01</p>
            <h2 id="t-resolvemos" className="display mt-4 text-5xl">
              Qué <em>resolvemos</em>
            </h2>
          </div>
          <ul className="grid gap-px bg-linea sm:grid-cols-2 lg:col-span-8">
            {area.bullets.map((b, i) => (
              <li key={b} className="flex gap-4 bg-papel-2 p-6">
                <span className="font-display text-xl text-lacre italic">{INCISOS[i]})</span>
                <span className="text-lg">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {area.slug === "laboral" && (
        <section id="calculadora" aria-labelledby="t-calc" className="bg-noche py-20 text-papel md:py-28">
          <div className="mx-auto max-w-[88rem] px-6">
            <p className="rotulo text-lacre-claro">§ 02 — Calculadora</p>
            <h2 id="t-calc" className="display mt-4 mb-14 text-[clamp(2.4rem,5vw,4.5rem)]">
              Estimá tu <em>indemnización.</em>
            </h2>
            <CalculadoraDespido />
          </div>
        </section>
      )}

      <section aria-labelledby="t-pasos" className="mx-auto max-w-[88rem] px-6 py-20 md:py-28">
        <p className="rotulo text-lacre">§ {area.slug === "laboral" ? "03" : "02"}</p>
        <h2 id="t-pasos" className="display mt-4 text-[clamp(2.4rem,5vw,4.5rem)]">
          Cómo lo <em>llevamos adelante</em>
        </h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {area.pasos.map((p, i) => (
            <li key={p.titulo} className="aparecer border-t border-tinta pt-6">
              <span className="rotulo text-tinta-3">Paso {i + 1}</span>
              <h3 className="mt-4 font-display text-2xl leading-tight">{p.titulo}</h3>
              <p className="mt-3 leading-relaxed text-tinta-2">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {testimonios.length > 0 && (
        <section aria-labelledby="t-casos" className="bg-papel-2 py-20 md:py-28">
          <div className="mx-auto max-w-[88rem] px-6">
            <h2 id="t-casos" className="display text-[clamp(2.4rem,5vw,4.5rem)]">
              Casos <em>resueltos</em>
            </h2>
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonios.map((t) => (
                <TestimonioCard key={t.expediente} testimonio={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {responsables.length > 0 && (
        <section aria-labelledby="t-responsables" className="mx-auto max-w-[88rem] px-6 py-20 md:py-28">
          <h2 id="t-responsables" className="display text-[clamp(2.4rem,5vw,4.5rem)]">
            Quién lleva <em>tu caso</em>
          </h2>
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {responsables.map((a) => (
              <TarjetaAbogado key={a.slug} abogado={a} nombresDeAreas={nombresDeAreas} />
            ))}
          </div>
        </section>
      )}

      {area.faqs.length > 0 && (
        <section aria-labelledby="t-faq" className="border-t border-linea">
          <div className="mx-auto grid max-w-[88rem] gap-12 px-6 py-20 md:py-28 lg:grid-cols-12">
            <h2 id="t-faq" className="display text-[clamp(2.4rem,5vw,4.25rem)] lg:col-span-4">
              Preguntas <em>frecuentes</em>
            </h2>
            <div className="lg:col-span-8">
              <FAQAccordion faqs={area.faqs} />
            </div>
          </div>
        </section>
      )}

      <section id="consulta" aria-labelledby="t-consulta" className="bg-noche py-20 text-papel md:py-28">
        <div className="mx-auto grid max-w-[88rem] gap-14 px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="rotulo text-lacre-claro">Consulta sin costo</p>
            <h2 id="t-consulta" className="display mt-6 text-[clamp(2.4rem,5vw,4.5rem)]">
              Contanos tu caso de <em>{area.nombre.replace("Derecho ", "").toLowerCase()}.</em>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-papel/70">
              Completá el formulario y seguís por WhatsApp con el resumen ya cargado. Una abogada del
              área te responde en 48 horas hábiles.
            </p>
          </div>
          <div className="lg:col-span-7">
            <FormularioCalificador
              tono="oscuro"
              areas={areas.map(({ slug, nombre }) => ({ slug, nombre }))}
              areaPreseleccionada={area.slug}
            />
          </div>
        </div>
      </section>

      <nav aria-label="Otras áreas" className="mx-auto max-w-[88rem] px-6 py-16">
        <p className="rotulo text-tinta-3">Otras áreas</p>
        <ul className="mt-6 flex flex-wrap gap-3">
          {otras.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/areas/${a.slug}`}
                className="inline-block rounded-full border border-linea px-5 py-2.5 transition-colors hover:border-tinta hover:bg-tinta hover:text-papel"
              >
                {a.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
