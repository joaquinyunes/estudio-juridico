/**
 * Contenido de demostración (placeholder) para el template.
 * Cuando exista un proyecto de Sanity real, estas funciones se reemplazan por
 * queries a `src/lib/sanity.ts` — ver PROGRESS.md, punto "Home / landings usan
 * contenido estático de demo".
 */

export type Faq = {
  pregunta: string;
  respuesta: string;
};

export type Testimonio = {
  tipoDeCaso: string;
  texto: string;
  areaSlug: string;
};

export type AreaDePractica = {
  slug: string;
  nombre: string;
  descripcionCorta: string;
  descripcionLarga: string;
  bullets: string[];
  faqs: Faq[];
};

export const datosDelEstudio = {
  nombre: "Estudio Jurídico Demo",
  telefonoWhatsapp: "5491100000000",
  direccion: "Av. Ejemplo 1234, CABA, Argentina",
  horarios: "Lunes a viernes de 9 a 18 hs",
  email: "contacto@estudio-demo.example",
};

export const areasDePractica: AreaDePractica[] = [
  {
    slug: "laboral",
    nombre: "Derecho Laboral",
    descripcionCorta:
      "Despidos, indemnizaciones y reclamos laborales con evaluación gratuita del caso.",
    descripcionLarga:
      "Si te despidieron, te redujeron el sueldo sin acuerdo o no te registran correctamente, evaluamos tu situación y te decimos con claridad si conviene iniciar un reclamo y qué podés esperar.",
    bullets: [
      "Despido con o sin causa",
      "Indemnizaciones y liquidación final",
      "Trabajo no registrado (\"en negro\")",
      "Accidentes y enfermedades laborales",
    ],
    faqs: [
      {
        pregunta: "¿Cuánto tarda un reclamo laboral?",
        respuesta:
          "Depende de si se resuelve por acuerdo extrajudicial o llega a juicio. Un acuerdo puede cerrarse en semanas; un juicio puede llevar más de un año.",
      },
      {
        pregunta: "¿Tiene costo la primera consulta?",
        respuesta:
          "La evaluación inicial de tu caso no tiene costo. Te lo confirmamos apenas completás el formulario.",
      },
      {
        pregunta: "¿Qué pasa si no tengo el despido por escrito?",
        respuesta:
          "Igual se puede reclamar. Hay formas de acreditar la relación laboral y el despido aunque no haya telegrama.",
      },
    ],
  },
  {
    slug: "familia",
    nombre: "Derecho de Familia",
    descripcionCorta:
      "Divorcios, alimentos y régimen de comunicación con un enfoque directo y sin vueltas.",
    descripcionLarga:
      "Acompañamos procesos de divorcio, cuota alimentaria y régimen de comunicación con los hijos, priorizando acuerdos rápidos cuando es posible y una defensa firme cuando no.",
    bullets: [
      "Divorcio de mutuo acuerdo o contencioso",
      "Cuota alimentaria",
      "Régimen de comunicación (visitas)",
      "Uniones convivenciales",
    ],
    faqs: [
      {
        pregunta: "¿Necesito estar de acuerdo con la otra parte para divorciarme?",
        respuesta:
          "No. El divorcio en Argentina no requiere acuerdo de la otra parte; alcanza con la voluntad de una sola persona.",
      },
      {
        pregunta: "¿Cómo se calcula la cuota alimentaria?",
        respuesta:
          "Se evalúan los ingresos de quien debe pagarla y las necesidades reales de los hijos. Lo vemos en la consulta inicial con el detalle de tu caso.",
      },
    ],
  },
  {
    slug: "penal",
    nombre: "Derecho Penal",
    descripcionCorta:
      "Defensa penal y asesoramiento urgente ante una denuncia o detención.",
    descripcionLarga:
      "Si estás siendo investigado, recibiste una notificación judicial o necesitás asesoramiento urgente, te contactamos a la brevedad para evaluar los pasos a seguir.",
    bullets: [
      "Defensa en causas penales",
      "Asesoramiento ante denuncias",
      "Excarcelaciones",
      "Querellas (representación de la víctima)",
    ],
    faqs: [
      {
        pregunta: "Me citaron a indagatoria, ¿qué hago?",
        respuesta:
          "Contactanos antes de presentarte. Es clave preparar la declaración con asesoramiento previo.",
      },
      {
        pregunta: "¿Atienden casos urgentes fuera de horario?",
        respuesta:
          "Sí, para causas penales con detención o plazos urgentes tenemos vía de contacto prioritaria por WhatsApp.",
      },
    ],
  },
  {
    slug: "comercial",
    nombre: "Derecho Comercial",
    descripcionCorta:
      "Contratos, sociedades y conflictos entre socios o con proveedores.",
    descripcionLarga:
      "Asesoramos a pequeñas y medianas empresas en la redacción de contratos, constitución de sociedades y resolución de conflictos comerciales antes de que escalen a juicio.",
    bullets: [
      "Redacción y revisión de contratos",
      "Constitución de sociedades",
      "Conflictos entre socios",
      "Cobro de deudas comerciales",
    ],
    faqs: [
      {
        pregunta: "¿Revisan contratos ya firmados?",
        respuesta:
          "Sí, evaluamos contratos vigentes para identificar riesgos y posibles reclamos.",
      },
    ],
  },
  {
    slug: "sucesiones",
    nombre: "Sucesiones",
    descripcionCorta:
      "Trámites sucesorios y herencias, incluidas sucesiones con conflictos entre herederos.",
    descripcionLarga:
      "Iniciamos y llevamos adelante el trámite sucesorio completo, y representamos a herederos en casos con desacuerdos sobre la partición de bienes.",
    bullets: [
      "Inicio de sucesión",
      "Partición de bienes",
      "Sucesiones con conflicto entre herederos",
      "Testamentos",
    ],
    faqs: [
      {
        pregunta: "¿Cuánto tarda una sucesión?",
        respuesta:
          "Una sucesión sin conflicto suele resolverse en varios meses; con desacuerdos entre herederos puede extenderse. Te damos un estimado real según tu caso en la consulta inicial.",
      },
    ],
  },
];

export const testimonios: Testimonio[] = [
  {
    tipoDeCaso: "Despido sin causa",
    texto:
      "Me indemnizaron correctamente después de un despido que la empresa quería resolver por mucho menos de lo que correspondía.",
    areaSlug: "laboral",
  },
  {
    tipoDeCaso: "Divorcio de mutuo acuerdo",
    texto:
      "El proceso fue más rápido de lo que esperaba y con acompañamiento claro en cada paso.",
    areaSlug: "familia",
  },
  {
    tipoDeCaso: "Conflicto entre socios",
    texto:
      "Resolvieron un conflicto societario que llevaba meses estancado, con un acuerdo que evitó un juicio largo.",
    areaSlug: "comercial",
  },
];

export function getAreaBySlug(slug: string): AreaDePractica | undefined {
  return areasDePractica.find((area) => area.slug === slug);
}

export function getTestimoniosByAreaSlug(areaSlug: string): Testimonio[] {
  return testimonios.filter((t) => t.areaSlug === areaSlug);
}
