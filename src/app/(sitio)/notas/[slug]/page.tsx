import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArea, getNota, getNotas } from "@/lib/cms";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/schema-org";
import { JsonLd } from "@/components/JsonLd";
import { TarjetaNota, formatoFecha } from "@/components/TarjetaNota";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return (await getNotas()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const nota = await getNota(slug);
  if (!nota) return {};
  return {
    title: nota.titulo,
    description: nota.bajada,
    alternates: { canonical: `/notas/${nota.slug}` },
    openGraph: {
      type: "article",
      title: nota.titulo,
      description: nota.bajada,
      publishedTime: nota.fecha,
      authors: [nota.autor],
      images: [nota.imagen],
    },
  };
}

export default async function NotaPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const nota = await getNota(slug);
  if (!nota) notFound();
  const [area, todas] = await Promise.all([getArea(nota.areaSlug), getNotas()]);
  const otras = todas.filter((n) => n.slug !== nota.slug).slice(0, 2);

  return (
    <article>
      <JsonLd data={buildArticleJsonLd(nota)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Notas", url: "/notas" },
          { name: nota.titulo, url: `/notas/${nota.slug}` },
        ])}
      />

      <header className="mx-auto max-w-4xl px-6 pt-10 md:pt-16">
        <p className="rotulo flex flex-wrap gap-3 text-tinta-3">
          <Link href="/notas" className="enlace text-lacre">
            Notas
          </Link>
          <span aria-hidden>/</span>
          <span>{nota.categoria}</span>
          <span aria-hidden>·</span>
          <time dateTime={nota.fecha}>{formatoFecha.format(new Date(nota.fecha))}</time>
          <span aria-hidden>·</span>
          <span>{nota.lectura} de lectura</span>
        </p>
        <h1 className="display mt-8 text-[clamp(2.6rem,6.5vw,5.5rem)]">{nota.titulo}</h1>
        <p className="mt-8 text-xl leading-relaxed text-tinta-2 md:text-2xl">{nota.bajada}</p>
        <p className="mt-8 border-t border-tinta pt-4 text-sm">
          Por <strong className="font-medium">{nota.autor}</strong>
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-6xl px-6">
        <div className="esquinas">
          <div className="brillo relative aspect-[21/10] bg-papel-3">
            <div className="paralaje">
              <Image
                src={nota.imagen}
                alt={nota.imagenAlt}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1152px) 1152px, 100vw"
                className="foto foto-vivo kenburns object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-16 md:py-20">
        {nota.cuerpo.map((bloque, i) => (
          <section key={i} className="mt-10 first:mt-0">
            {bloque.subtitulo && <h2 className="font-display text-3xl">{bloque.subtitulo}</h2>}
            {bloque.parrafos.map((p, j) => (
              <p
                key={j}
                className={`mt-5 text-lg leading-[1.8] text-tinta-2 ${i === 0 && j === 0 ? "capitular" : ""}`}
              >
                {p}
              </p>
            ))}
          </section>
        ))}

        <div className="mt-16 border-l-2 border-lacre bg-papel-2 p-7">
          <p className="rotulo text-lacre">¿Te pasa algo parecido?</p>
          <p className="mt-3 font-display text-2xl leading-snug">
            Contanos tu caso y te decimos en 48 h si conviene avanzar.
          </p>
          <Link
            href={`/contacto?area=${nota.areaSlug}`}
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-tinta px-6 py-3 text-papel transition-colors hover:bg-lacre"
          >
            Consultar sin costo <span aria-hidden>→</span>
          </Link>
          {area && (
            <Link href={`/areas/${area.slug}`} className="enlace rotulo mt-6 block w-fit">
              Más sobre {area.nombre} →
            </Link>
          )}
        </div>

        <p className="mt-10 text-sm text-tinta-3">
          Esta nota es informativa y no reemplaza el asesoramiento profesional sobre un caso concreto.
        </p>
      </div>

      {otras.length > 0 && (
        <section aria-labelledby="t-otras" className="border-t border-tinta">
          <div className="mx-auto max-w-[88rem] px-6 py-20">
            <h2 id="t-otras" className="rotulo text-tinta-3">Seguí leyendo</h2>
            <div className="mt-10 grid gap-14 md:grid-cols-2">
              {otras.map((n) => (
                <TarjetaNota key={n.slug} nota={n} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
