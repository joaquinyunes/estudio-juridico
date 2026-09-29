import type { Metadata } from "next";
import { getDatosDelEstudio } from "@/lib/cms";
import { CabeceraPagina } from "@/components/CabeceraPagina";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo tratamos los datos personales que nos enviás, según la Ley 25.326.",
  alternates: { canonical: "/legales/privacidad" },
};

export default async function PrivacidadPage() {
  const datos = await getDatosDelEstudio();
  const secciones = [
    {
      titulo: "Responsable",
      texto: `${datos.nombreLegal}, con domicilio en ${datos.direccion}, ${datos.localidad}, es responsable de la base de datos en la que se registran las consultas recibidas por este sitio.`,
    },
    {
      titulo: "Qué datos recopilamos",
      texto:
        "Solo los que ingresás en el formulario de consulta: nombre, área de la consulta, nivel de urgencia y el resumen de tu caso. La calculadora de indemnización funciona en tu navegador y no envía los datos que cargás.",
    },
    {
      titulo: "Para qué los usamos",
      texto:
        "Exclusivamente para evaluar y responder tu consulta. No los vendemos, no los cedemos a terceros y no los usamos con fines publicitarios. Están protegidos por el secreto profesional.",
    },
    {
      titulo: "Tus derechos",
      texto: `Podés solicitar el acceso, la rectificación o la supresión de tus datos en cualquier momento escribiendo a ${datos.email}, en los términos de la Ley 25.326 de Protección de los Datos Personales. La Agencia de Acceso a la Información Pública, órgano de control de la ley, atiende las denuncias y reclamos relativos a su incumplimiento.`,
    },
    {
      titulo: "Medición del sitio",
      texto:
        "Usamos herramientas de analítica que registran de forma agregada cómo se navega el sitio (páginas visitadas, clics en botones). No identifican a personas concretas.",
    },
  ];

  return (
    <>
      <CabeceraPagina rotulo="Legales" titulo={<>Política de <em>privacidad.</em></>} />
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
      </div>
    </>
  );
}
