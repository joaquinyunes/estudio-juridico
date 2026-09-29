import type { Metadata } from "next";
import Link from "next/link";
import { getArea } from "@/lib/cms";
import { CalculadoraDespido } from "@/components/CalculadoraDespido";
import { FAQAccordion } from "@/components/FAQAccordion";
import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd, SITE_URL } from "@/lib/schema-org";

export const metadata: Metadata = {
  title: "Calculadora de indemnización por despido 2026",
  description:
    "Calculá tu indemnización por despido sin causa en Argentina, actualizada con la reforma laboral 2026 (Ley 27.802): antigüedad, preaviso, integración, SAC y vacaciones.",
  alternates: { canonical: "/calculadora-indemnizacion" },
};

const FAQS_CALCULADORA = [
  {
    pregunta: "¿Qué sueldo tengo que poner?",
    respuesta:
      "La mejor remuneración mensual, normal y habitual del último año, en bruto. Desde la Ley 27.802 no se incluyen el aguinaldo, las vacaciones ni los premios que no se cobran todos los meses; los conceptos variables se promedian.",
  },
  {
    pregunta: "¿Por qué el monto real puede ser distinto?",
    respuesta:
      "Porque la calculadora no aplica el tope del convenio colectivo de tu actividad, ni el piso fijado por la Corte Suprema en el fallo “Vizzoti”, ni agravantes como el despido discriminatorio o por embarazo. Una abogada puede ajustar el cálculo a tu caso.",
  },
  {
    pregunta: "¿Tengo que pagar para que revisen el cálculo?",
    respuesta: "No. La primera evaluación de tu caso es sin costo y te respondemos en 48 horas hábiles.",
  },
];

export default async function CalculadoraPage() {
  const laboral = await getArea("laboral");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Calculadora de indemnización por despido",
          url: `${SITE_URL}/calculadora-indemnizacion`,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          inLanguage: "es-AR",
          offers: { "@type": "Offer", price: "0", priceCurrency: "ARS" },
        }}
      />
      <JsonLd data={buildFaqPageJsonLd(FAQS_CALCULADORA)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: "Calculadora de indemnización", url: "/calculadora-indemnizacion" },
        ])}
      />

      <section className="bg-noche text-papel">
        <div className="mx-auto max-w-[88rem] px-6 pt-14 pb-24 md:pt-20 md:pb-32">
          <p className="rotulo text-lacre-claro">Herramienta gratuita · Actualizada 2026</p>
          <h1 className="display mt-6 max-w-5xl text-[clamp(2.8rem,7vw,6.5rem)]">
            Calculadora de <em>indemnización por despido.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-papel/70">
            Cargá tu sueldo y tus fechas y mirá, renglón por renglón, lo que te corresponde según la
            Ley de Contrato de Trabajo y la reforma de la Ley 27.802. Tus datos no salen de tu
            dispositivo.
          </p>
          <div className="mt-16">
            <CalculadoraDespido />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[88rem] gap-12 px-6 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="display text-[clamp(2.2rem,4.5vw,3.75rem)]">
            Cómo se <em>calcula</em>
          </h2>
          {laboral && (
            <Link href={`/areas/${laboral.slug}`} className="enlace rotulo mt-8 inline-block text-lacre">
              Ver {laboral.nombre} →
            </Link>
          )}
        </div>
        <div className="space-y-10 lg:col-span-8">
          <dl className="grid gap-px bg-linea sm:grid-cols-2">
            {[
              ["Antigüedad (art. 245)", "Un sueldo por cada año trabajado o fracción mayor de tres meses. Mínimo, un sueldo."],
              ["Preaviso (arts. 231/232)", "Un mes si trabajaste hasta cinco años; dos meses si fueron más. No corre en el período de prueba."],
              ["Integración (art. 233)", "Los días que faltan para terminar el mes del despido, si no hubo preaviso."],
              ["Liquidación final", "Días trabajados del mes, aguinaldo proporcional y vacaciones no gozadas. Se deben siempre."],
            ].map(([t, d]) => (
              <div key={t} className="bg-papel p-6">
                <dt className="font-display text-xl">{t}</dt>
                <dd className="mt-2 leading-relaxed text-tinta-2">{d}</dd>
              </div>
            ))}
          </dl>
          <FAQAccordion faqs={FAQS_CALCULADORA} />
        </div>
      </section>
    </>
  );
}
