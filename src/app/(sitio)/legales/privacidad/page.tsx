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
      titulo: "Datos sensibles y secreto profesional",
      texto:
        "Te pedimos que en el formulario cuentes solo lo mínimo para orientarte y que no incluyas datos sensibles (salud, religión, afiliación sindical o política, vida sexual, origen racial o étnico), números de documento, contraseñas ni documentos. Lo que nos compartas está alcanzado por el secreto profesional. Enviar el formulario no genera una relación profesional: eso ocurre recién cuando acordamos el encargo.",
    },
    {
      titulo: "Quiénes procesan los datos y dónde",
      texto:
        "Para recibir tu consulta usamos proveedores que actúan por nuestra cuenta: un servicio de alojamiento y de contenidos (Vercel y Sanity), un servicio de envío de correo (Resend) y, si elegís continuar por ese medio, WhatsApp. Algunos de estos proveedores almacenan datos fuera de la Argentina, por ejemplo en Estados Unidos o la Unión Europea. Los datos solo se comparten con ellos para prestar el servicio, y las consultas se guardan en un espacio privado de acceso restringido al estudio.",
    },
    {
      titulo: "Cuánto tiempo los conservamos",
      texto:
        "Solo el tiempo necesario para evaluar y responder tu consulta, y para cumplir las obligaciones profesionales si luego nos encargás el caso. Si no seguimos adelante, los suprimimos cuando lo pidas (ver «Tus derechos»).",
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
