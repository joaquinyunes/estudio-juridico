import Image from "next/image";
import Link from "next/link";
import { historia, principios } from "@/lib/content";
import {
  getAreas,
  getCifras,
  getDatosDelEstudio,
  getFaqsGenerales,
  getEquipo,
  getNotas,
  getTestimonios,
} from "@/lib/cms";
import { buildFaqPageJsonLd } from "@/lib/schema-org";
import { Sello } from "@/components/Sello";
import { Marquesina } from "@/components/Marquesina";
import { EncabezadoSeccion } from "@/components/EncabezadoSeccion";
import { ListaAreas } from "@/components/ListaAreas";
import { CalculadoraDespido } from "@/components/CalculadoraDespido";
import { TestimonioCard } from "@/components/TestimonioCard";
import { LineaDeTiempo } from "@/components/LineaDeTiempo";
import { TarjetaAbogado } from "@/components/TarjetaAbogado";
import { TarjetaNota } from "@/components/TarjetaNota";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FormularioCalificador } from "@/components/FormularioCalificador";
import { JsonLd } from "@/components/JsonLd";
import { Contador } from "@/components/Contador";

const METODO = [
  {
    numero: "I",
    titulo: "Nos contás tu caso",
    texto: "Por el formulario o por WhatsApp. Cinco minutos, desde donde estés.",
  },
  {
    numero: "II",
    titulo: "Te respondemos en 48 h",
    texto: "Una abogada del área evalúa si tu caso es viable y qué podés esperar. Sin costo.",
  },
  {
    numero: "III",
    titulo: "Estrategia y honorarios por escrito",
    texto: "Qué vamos a hacer, cuánto puede tardar y cuánto cuesta. Antes de que firmes nada.",
  },
  {
    numero: "IV",
    titulo: "Te acompañamos hasta el final",
    texto: "El mismo abogado de principio a fin, con aviso de cada movimiento del expediente.",
  },
];

const TITULAR = [
  <>La ley es</>,
  <>compleja.</>,
  <em key="e">Tu abogado,</em>,
  <>no.</>,
];

export default async function HomePage() {
  const [areas, testimonios, equipo, notas, datos, cifras, faqsGenerales] = await Promise.all([
    getAreas(),
    getTestimonios(),
    getEquipo(),
    getNotas(),
    getDatosDelEstudio(),
    getCifras(),
    getFaqsGenerales(),
  ]);
  const nombresDeAreas = Object.fromEntries(areas.map((a) => [a.slug, a.nombre]));
  const faqs = [...faqsGenerales, ...areas.flatMap((a) => a.faqs.slice(0, 1))].slice(0, 7);

  return (
    <>
      <JsonLd data={buildFaqPageJsonLd(faqs)} />

      {/* ——— Portada ——— */}
      <section className="mx-auto max-w-[88rem] px-6 pt-8 pb-16 md:pt-14 md:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 lg:pt-6">
            <p className="rotulo flex flex-wrap items-center gap-x-3 gap-y-2 text-tinta-3">
              <span className="text-lacre">Estudio jurídico</span>
              <span aria-hidden className="h-px w-8 bg-linea" />
              <span>Buenos Aires</span>
              <span aria-hidden className="h-px w-8 bg-linea" />
              <span>Desde {datos.fundacion}</span>
            </p>

            <h1 className="display mt-7 text-[clamp(3.4rem,7.2vw,7rem)]">
              {TITULAR.map((linea, i) => (
                <span key={i} className="linea-titular">
                  <span style={{ animationDelay: `${120 + i * 110}ms` }}>{linea}</span>
                </span>
              ))}
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-tinta-2 md:text-xl">
              Treinta y nueve años frente a Tribunales explicando el derecho en castellano. Contanos
              tu caso y en 48 horas te decimos, sin costo, si conviene avanzar y qué podés esperar.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/contacto"
                className="group inline-flex items-center gap-3 rounded-full bg-tinta py-4 pr-4 pl-7 text-papel transition-colors hover:bg-lacre"
              >
                Contanos tu caso
                <span
                  aria-hidden
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-papel text-tinta transition-transform duration-500 group-hover:rotate-[-45deg]"
                >
                  →
                </span>
              </Link>
              <Link
                href="#calculadora"
                className="inline-flex items-center gap-2 rounded-full border border-tinta px-7 py-4 transition-colors hover:bg-tinta hover:text-papel"
              >
                Calcular mi indemnización
              </Link>
            </div>
          </div>

          <figure className="relative lg:col-span-5">
            <div className="marco marco-arco">
              <div className="arco brillo abrir relative aspect-[4/5] bg-papel-3 lg:aspect-[3/4]">
                <div className="paralaje">
                  <Image
                    src="/img/hero-congreso.jpg"
                    alt="Cúpula verde del Palacio del Congreso de la Nación, en Buenos Aires, al atardecer"
                    fill
                    loading="eager"
                    fetchPriority="high"
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="foto foto-vivo kenburns object-cover object-top"
                  />
                </div>
              </div>
            </div>
            <Sello className="flotar absolute -bottom-8 -left-4 z-10 h-28 w-28 drop-shadow-xl md:h-36 md:w-36 lg:-left-16" />
            <figcaption className="rotulo mt-5 text-right !text-[0.68rem] text-tinta-3">
              Fig. 1 — Palacio del Congreso, Buenos Aires
            </figcaption>
          </figure>
        </div>

        <dl className="filete-doble mt-16 grid grid-cols-2 gap-x-6 gap-y-10 pt-10 text-tinta md:mt-24 lg:grid-cols-4">
          {cifras.map((c, i) => (
            <div key={c.texto} className="aparecer escalon" style={{ "--i": i } as React.CSSProperties}>
              <dt className="sr-only">{c.texto}</dt>
              <dd>
                <span className="display text-[clamp(3rem,6vw,5rem)]">
                  <Contador valor={c.valor} />
                </span>
                <span className="font-display text-3xl text-lacre italic">{c.unidad}</span>
                <span className="mt-2 block max-w-[14rem] text-sm text-tinta-2">{c.texto}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Marquesina items={areas.map((a) => a.nombre)} />

      {/* ——— § 01 El estudio ——— */}
      <section id="estudio" aria-labelledby="t-estudio" className="mx-auto max-w-[88rem] px-6 py-24 md:py-36">
        <EncabezadoSeccion
          id="t-estudio"
          numero="01"
          rotulo="El estudio"
          titulo={
            <>
              Hablamos claro <em>desde 1987.</em>
            </>
          }
        />
        <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5 md:col-start-1">
            <div className="marco marco-arco">
              <div className="arco brillo relative aspect-[3/4] bg-papel-3">
                <Image
                  src="/img/biblioteca-escalera.jpg"
                  alt="Escalera de madera apoyada en una biblioteca de libros antiguos"
                  fill
                  sizes="(min-width: 768px) 38vw, 100vw"
                  className="foto foto-vivo revelar-foto object-cover"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-7 md:pl-8 lg:pl-16">
            <p className="capitular text-xl leading-relaxed text-tinta-2 md:text-[1.35rem]">
              Ernesto Iturbe abrió el estudio con una convicción simple: nadie debería salir de la
              oficina de un abogado sabiendo menos que cuando entró. Treinta y nueve años después,
              somos siete abogados y cinco áreas de práctica, pero la regla es la misma. Te
              explicamos tu situación en palabras que se entienden, te decimos la verdad aunque no
              sea lo que querías escuchar, y ponemos todo por escrito.
            </p>
            <ol className="mt-14 border-t border-tinta">
              {principios.map((p) => (
                <li key={p.titulo} className="aparecer grid gap-3 border-b border-linea py-7 sm:grid-cols-[7rem_1fr]">
                  <span className="rotulo pt-2 text-lacre">{p.articulo}</span>
                  <div>
                    <h3 className="font-display text-3xl">{p.titulo}</h3>
                    <p className="mt-2 leading-relaxed text-tinta-2">{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ——— § 02 Áreas ——— */}
      <section id="areas" aria-labelledby="t-areas" className="mx-auto max-w-[88rem] px-6 pb-24 md:pb-36">
        <EncabezadoSeccion
          id="t-areas"
          numero="02"
          rotulo="Áreas de práctica"
          titulo={
            <>
              Cinco áreas. <em>Un mismo criterio.</em>
            </>
          }
          bajada="Cada área tiene su abogada o abogado responsable. Elegí la tuya para ver qué resolvemos, cómo trabajamos y las preguntas más frecuentes."
        />
        <div className="mt-14">
          <ListaAreas areas={areas} />
        </div>
      </section>

      {/* ——— § 03 Calculadora ——— */}
      <section id="calculadora" aria-labelledby="t-calc" className="noche-vivo bg-noche py-24 text-papel md:py-36">
        <div className="mx-auto max-w-[88rem] px-6">
          <EncabezadoSeccion
            id="t-calc"
            claro
            numero="03"
            rotulo="Calculadora laboral"
            titulo={
              <>
                ¿Te despidieron? <em>Sabé cuánto te corresponde.</em>
              </>
            }
            bajada="Estimación al instante, actualizada con la reforma laboral de 2026 (Ley 27.802). Sin registrarte y sin que tus datos salgan de tu teléfono."
          />
          <div className="mt-16">
            <CalculadoraDespido />
          </div>
        </div>
      </section>

      {/* ——— § 04 Método ——— */}
      <section aria-labelledby="t-metodo" className="mx-auto max-w-[88rem] px-6 py-24 md:py-36">
        <EncabezadoSeccion
          id="t-metodo"
          numero="04"
          rotulo="Cómo trabajamos"
          titulo={
            <>
              Cuatro pasos, <em>cero sorpresas.</em>
            </>
          }
        />
        <ol className="mt-16 grid gap-px overflow-hidden border border-linea bg-linea md:grid-cols-2 lg:grid-cols-4">
          {METODO.map((paso, i) => (
            <li
              key={paso.numero}
              style={{ "--i": i } as React.CSSProperties}
              className="aparecer escalon group relative flex flex-col bg-papel p-8 transition-colors duration-500 hover:bg-papel-2 md:p-10"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-lacre transition-transform duration-700 ease-[var(--ease-folio)] group-hover:scale-x-100"
              />
              <span className="font-display text-6xl text-lacre italic transition-transform duration-500 ease-[var(--ease-folio)] [font-variation-settings:'SOFT'_100,'WONK'_1] group-hover:translate-x-2 group-hover:scale-110">
                {paso.numero}
              </span>
              <h3 className="mt-10 font-display text-2xl leading-tight">{paso.titulo}</h3>
              <p className="mt-3 leading-relaxed text-tinta-2">{paso.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ——— § 05 Casos ——— */}
      <section aria-labelledby="t-casos" className="bg-papel-2 py-24 md:py-36">
        <div className="mx-auto max-w-[88rem] px-6">
          <EncabezadoSeccion
            id="t-casos"
            numero="05"
            rotulo="Casos resueltos"
            titulo={
              <>
                Expedientes que <em>hablan por nosotros.</em>
              </>
            }
            bajada="Testimonios reales de clientes, anonimizados por secreto profesional. Sin nombres, con resultados."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonios.slice(0, 3).map((t, i) => (
              <TestimonioCard
                key={t.expediente}
                testimonio={t}
                className={`aparecer ${i === 1 ? "lg:mt-16" : ""}`}
              />
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link href="/testimonios" className="enlace rotulo text-tinta">
              Ver todos los casos →
            </Link>
          </div>
        </div>
      </section>

      {/* ——— § 06 Historia ——— */}
      <section aria-labelledby="t-historia" className="noche-vivo bg-noche py-24 text-papel md:py-36">
        <div className="mx-auto max-w-[88rem] px-6">
          <EncabezadoSeccion
            id="t-historia"
            claro
            numero="06"
            rotulo="Historia"
            titulo={
              <>
                Treinta y nueve años <em>en la misma puerta.</em>
              </>
            }
            bajada="De una máquina de escribir a la guardia por WhatsApp. Deslizá para recorrer la historia del estudio."
          />
        </div>
        <div className="mt-16">
          <LineaDeTiempo hitos={historia} />
        </div>
      </section>

      {/* ——— § 07 Equipo ——— */}
      <section aria-labelledby="t-equipo" className="mx-auto max-w-[88rem] px-6 py-24 md:py-36">
        <EncabezadoSeccion
          id="t-equipo"
          numero="07"
          rotulo="Equipo"
          titulo={
            <>
              Las personas <em>detrás de cada caso.</em>
            </>
          }
        />
        <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {equipo
            .filter((a) => a.socio)
            .slice(0, 4)
            .map((abogado) => (
              <TarjetaAbogado key={abogado.slug} abogado={abogado} nombresDeAreas={nombresDeAreas} />
            ))}
        </div>
        <div className="mt-14">
          <Link
            href="/equipo"
            className="inline-flex items-center gap-2 rounded-full border border-tinta px-7 py-4 transition-colors hover:bg-tinta hover:text-papel"
          >
            Conocé a todo el equipo <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* ——— § 08 Notas ——— */}
      <section aria-labelledby="t-notas" className="mx-auto max-w-[88rem] px-6 pb-24 md:pb-36">
        <EncabezadoSeccion
          id="t-notas"
          numero="08"
          rotulo="Notas"
          titulo={
            <>
              Para entender <em>tus derechos.</em>
            </>
          }
        />
        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-10">
          {notas[0] && (
            <div className="lg:col-span-7">
              <TarjetaNota nota={notas[0]} variante="destacada" />
            </div>
          )}
          <div className="flex flex-col gap-10 lg:col-span-5 lg:border-l lg:border-linea lg:pl-10">
            {notas.slice(1, 3).map((nota) => (
              <TarjetaNota key={nota.slug} nota={nota} variante="horizontal" />
            ))}
            <Link href="/notas" className="enlace rotulo w-fit">
              Todas las notas →
            </Link>
          </div>
        </div>
      </section>

      {/* ——— § 09 Preguntas ——— */}
      <section aria-labelledby="t-faq" className="bg-papel-2 py-24 md:py-36">
        <div className="mx-auto grid max-w-[88rem] gap-12 px-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="rotulo text-lacre">
                § 09 <span className="text-tinta-3">— Preguntas</span>
              </p>
              <h2 id="t-faq" className="display mt-6 text-[clamp(2.4rem,5vw,4.25rem)]">
                Lo que todos <em>nos preguntan.</em>
              </h2>
              <Link href="/preguntas-frecuentes" className="enlace rotulo mt-8 inline-block">
                Ver todas las preguntas →
              </Link>
            </div>
          </div>
          <div className="lg:col-span-8">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* ——— § 10 Contacto ——— */}
      <section id="contacto" aria-labelledby="t-contacto" className="mx-auto max-w-[88rem] px-6 py-24 md:py-36">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="rotulo text-lacre">
              § 10 <span className="text-tinta-3">— Contacto</span>
            </p>
            <h2 id="t-contacto" className="display mt-6 text-[clamp(2.4rem,5vw,4.5rem)]">
              Contanos tu caso. <em>Te respondemos en 48 h.</em>
            </h2>
            <div className="esquinas mt-12">
              <div className="brillo relative aspect-[16/10] bg-papel-3">
                <div className="paralaje">
                  <Image
                    src="/img/obelisco.jpg"
                    alt="Avenida de Buenos Aires con el Obelisco al fondo"
                    fill
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="foto foto-vivo object-cover"
                  />
                </div>
              </div>
            </div>
            <address className="mt-8 grid grid-cols-2 gap-6 text-sm not-italic">
              <div>
                <p className="rotulo text-tinta-3">Oficina</p>
                <p className="mt-2 leading-relaxed">
                  {datos.direccion}
                  <br />
                  {datos.referencia}
                </p>
              </div>
              <div>
                <p className="rotulo text-tinta-3">Horario</p>
                <p className="mt-2 leading-relaxed">
                  {datos.horarios}
                  <br />
                  <span className="text-lacre">{datos.guardia}</span>
                </p>
              </div>
            </address>
          </div>
          <div className="lg:col-span-7 lg:pl-10">
            <div className="border border-linea bg-papel p-7 shadow-[12px_12px_0_var(--color-papel-3)] md:p-12">
              <FormularioCalificador areas={areas.map(({ slug, nombre }) => ({ slug, nombre }))} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
