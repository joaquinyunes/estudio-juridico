import type { Metadata } from "next";
import { getAreas, getDatosDelEstudio } from "@/lib/cms";
import { FormularioCalificador } from "@/components/FormularioCalificador";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { MapaOficina } from "@/components/MapaOficina";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contanos tu caso y te respondemos en 48 horas hábiles, sin costo. Oficina frente a Tribunales, en Talcahuano 638, CABA.",
  alternates: { canonical: "/contacto" },
};

export default async function ContactoPage({ searchParams }: PageProps<"/contacto">) {
  const { area } = await searchParams;
  const [areas, datos] = await Promise.all([getAreas(), getDatosDelEstudio()]);
  const direccionMapa = encodeURIComponent(`${datos.direccion}, ${datos.localidad}`);

  return (
    <div className="mx-auto max-w-[88rem] px-6 pt-10 pb-24 md:pt-16">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="rotulo text-lacre">Contacto</p>
          <h1 className="display mt-6 text-[clamp(3rem,7vw,6.5rem)]">
            Contanos <em>tu caso.</em>
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-tinta-2">
            Cuatro preguntas y seguís por WhatsApp con el resumen ya escrito. Una abogada del área te
            responde en 48 horas hábiles. La evaluación inicial no tiene costo.
          </p>

          <dl className="mt-12 space-y-6 border-t border-tinta pt-8">
            <div className="grid grid-cols-[7rem_1fr] gap-4">
              <dt className="rotulo pt-1 text-tinta-3">Oficina</dt>
              <dd>
                {datos.direccion}, {datos.localidad}
                <br />
                <span className="text-tinta-3">{datos.referencia}</span>
              </dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-4">
              <dt className="rotulo pt-1 text-tinta-3">Horario</dt>
              <dd>{datos.horarios}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-4">
              <dt className="rotulo pt-1 text-tinta-3">Teléfono</dt>
              <dd>
                <a href={`tel:${datos.telefono.replace(/[^\d+]/g, "")}`} className="enlace">
                  {datos.telefono}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-4">
              <dt className="rotulo pt-1 text-tinta-3">Email</dt>
              <dd>
                <a href={`mailto:${datos.email}`} className="enlace break-all">
                  {datos.email}
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-10 border-l-2 border-lacre bg-papel-2 p-6">
            <p className="rotulo text-lacre">¿Urgencia penal?</p>
            <p className="mt-3 leading-relaxed text-tinta-2">
              Si hay una detención o una indagatoria en curso, no completes el formulario: escribí
              directo a la guardia, que responde las 24 horas.
            </p>
            <WhatsAppCTA
              mensaje="URGENTE — Necesito asistencia penal ahora."
              origen="contacto-guardia"
              className="mt-2 inline-flex min-h-11 items-center gap-2 font-medium text-lacre underline underline-offset-4"
            >
              Escribir a la guardia 24 h →
            </WhatsAppCTA>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="border border-linea bg-papel p-7 shadow-[12px_12px_0_var(--color-papel-3)] md:p-12">
            <FormularioCalificador
              areas={areas.map(({ slug, nombre }) => ({ slug, nombre }))}
              areaPreseleccionada={typeof area === "string" ? area : undefined}
            />
          </div>
        </div>
      </div>

      <section aria-label="Mapa de la oficina" className="mt-24">
        <MapaOficina direccion={`${datos.direccion}, ${datos.localidad}`} />
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${direccionMapa}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rotulo mt-2 inline-flex min-h-11 items-center"
        >
          <span className="enlace">Cómo llegar →</span>
        </a>
      </section>
    </div>
  );
}
