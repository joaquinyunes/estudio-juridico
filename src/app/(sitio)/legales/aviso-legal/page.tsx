import type { Metadata } from "next";
import { getDatosDelEstudio } from "@/lib/cms";
import { CabeceraPagina } from "@/components/CabeceraPagina";

export const metadata: Metadata = {
  title: "Aviso legal",
  alternates: { canonical: "/legales/aviso-legal" },
};

export default async function AvisoLegalPage() {
  const datos = await getDatosDelEstudio();
  const secciones = [
    {
      titulo: "Carácter de la información",
      texto: `La información publicada en este sitio por ${datos.nombreLegal} tiene carácter informativo general y no constituye asesoramiento legal para un caso particular. Cada situación requiere un análisis profesional de sus circunstancias.`,
    },
    {
      titulo: "Relación profesional",
      texto:
        "El envío de un formulario, correo electrónico o mensaje de WhatsApp no genera por sí mismo una relación abogado-cliente. Esa relación comienza únicamente cuando el estudio acepta el caso de manera expresa y se acuerdan por escrito los términos del servicio y los honorarios.",
    },
    {
      titulo: "Calculadora de indemnización",
      texto:
        "Los montos que arroja la calculadora son estimaciones orientativas basadas en la Ley de Contrato de Trabajo y sus reformas. No contemplan topes de convenio colectivo, jurisprudencia aplicable ni circunstancias particulares, y no constituyen una promesa de resultado.",
    },
    {
      titulo: "Testimonios",
      texto:
        "Los testimonios se publican anonimizados, con autorización de los clientes y resguardando el secreto profesional. Los resultados de casos anteriores no garantizan resultados similares en casos futuros.",
    },
    {
      titulo: "Matriculación",
      texto:
        "Los profesionales del estudio se encuentran matriculados en el Colegio Público de la Abogacía de la Capital Federal y sujetos a su Código de Ética.",
    },
    {
      titulo: "Propiedad intelectual",
      texto:
        "Los textos, el diseño y la marca de este sitio pertenecen al estudio. Las fotografías se utilizan bajo la licencia de Unsplash.",
    },
  ];

  return (
    <>
      <CabeceraPagina rotulo="Legales" titulo={<>Aviso <em>legal.</em></>} />
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <ol className="space-y-12">
          {secciones.map((s, i) => (
            <li key={s.titulo} className="grid gap-3 sm:grid-cols-[5rem_1fr]">
              <span className="rotulo pt-2 text-lacre">Art. {i + 1}°</span>
              <div>
                <h2 className="font-display text-2xl">{s.titulo}</h2>
                <p className="mt-3 leading-relaxed text-tinta-2">{s.texto}</p>
              </div>
            </li>
          ))}
        </ol>
        {datos.modoDemo && (
          <p className="mt-16 border-t border-linea pt-6 text-sm text-tinta-3">
            Texto modelo del template: debe ser revisado y aprobado por el estudio antes del
            lanzamiento.
          </p>
        )}
      </div>
    </>
  );
}
