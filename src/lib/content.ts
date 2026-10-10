/**
 * Contenido de DEMOSTRACIÓN del template.
 *
 * "Iturbe & Lavalle" es un estudio ficticio: nombres, matrículas, cifras,
 * direcciones y testimonios son ilustrativos y deben reemplazarse por los del
 * estudio real antes del lanzamiento (ver PROGRESS.md).
 *
 * Este archivo es la fuente de respaldo. Cuando se configura
 * NEXT_PUBLIC_SANITY_PROJECT_ID, `src/lib/cms.ts` lee lo mismo desde el panel
 * de Sanity y solo cae acá si el panel está vacío o no responde.
 */

export type Faq = {
  pregunta: string;
  respuesta: string;
};

export type Testimonio = {
  expediente: string;
  tipoDeCaso: string;
  texto: string;
  resultado: string;
  areaSlug: string;
  anio: number;
};

export type AreaDePractica = {
  slug: string;
  numero: string;
  nombre: string;
  titular: string;
  descripcionCorta: string;
  descripcionLarga: string;
  imagen: string;
  imagenAlt: string;
  bullets: string[];
  pasos: { titulo: string; texto: string }[];
  faqs: Faq[];
};

export type Abogado = {
  slug: string;
  nombre: string;
  cargo: string;
  areas: string[];
  matricula: string;
  formacion: string;
  bio: string;
  foto: string;
  socio: boolean;
};

export type Hito = {
  anio: string;
  titulo: string;
  texto: string;
  imagen: string;
  imagenAlt: string;
};

export type Nota = {
  slug: string;
  titulo: string;
  bajada: string;
  categoria: string;
  areaSlug: string;
  fecha: string;
  lectura: string;
  autor: string;
  imagen: string;
  imagenAlt: string;
  cuerpo: { subtitulo?: string; parrafos: string[] }[];
};

export const datosDelEstudio = {
  nombre: "Iturbe & Lavalle",
  nombreLegal: "Iturbe & Lavalle — Abogados",
  fundacion: 1987,
  telefonoWhatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5491100000000",
  telefono: "+54 11 4371-0000",
  direccion: "Talcahuano 638, piso 4",
  localidad: "Ciudad Autónoma de Buenos Aires",
  codigoPostal: "C1013AAN",
  referencia: "Frente al Palacio de Tribunales",
  horarios: "Lunes a viernes de 9 a 18 h",
  guardia: "Guardia penal 24 h por WhatsApp",
  email: "consultas@iturbelavalle.example",
  geo: { lat: -34.6019, lng: -58.3857 },
  redes: {
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
  },
  /** Muestra el aviso "estudio ficticio" en el pie. Poner en false con datos reales. */
  modoDemo: true,
};

export type Cifra = { valor: string; unidad: string; texto: string };

/**
 * Aviso de demostración (solo se usa sin Sanity configurado, para mostrar la
 * función a quien evalúa el sitio). Con el panel conectado manda el panel.
 */
export const avisoDemo = {
  etiqueta: "Novedad",
  texto: "Nueva nota: qué cambió en las indemnizaciones por despido con la reforma laboral.",
  enlace: "/notas/reforma-laboral-2026-que-cambia-si-te-despiden",
  enlaceTexto: "Leer la nota",
};

export const cifras: Cifra[] = [
  { valor: "39", unidad: "años", texto: "ejerciendo frente a Tribunales" },
  { valor: "4.200", unidad: "+", texto: "casos acompañados desde 1987" },
  { valor: "48", unidad: "h", texto: "para responder si tu caso es viable" },
  { valor: "7", unidad: "", texto: "abogados matriculados en CPACF" },
];

export const principios = [
  {
    articulo: "Art. 1°",
    titulo: "Claridad",
    texto:
      "Antes de empezar te decimos, por escrito, qué podés esperar, cuánto puede tardar y cuánto cuesta. Sin letra chica.",
  },
  {
    articulo: "Art. 2°",
    titulo: "Compromiso",
    texto:
      "Un mismo abogado lleva tu caso de principio a fin y te informa cada movimiento del expediente sin que tengas que pedirlo.",
  },
  {
    articulo: "Art. 3°",
    titulo: "Reserva",
    texto:
      "Lo que nos contás queda entre vos y el estudio. El secreto profesional es la base de todo lo demás.",
  },
];

export const areasDePractica: AreaDePractica[] = [
  {
    slug: "laboral",
    numero: "01",
    nombre: "Derecho Laboral",
    titular: "Si te despidieron, tenés derechos. Y plazos.",
    descripcionCorta:
      "Despidos, indemnizaciones, trabajo no registrado y accidentes laborales. Evaluación del caso sin costo.",
    descripcionLarga:
      "Si te despidieron, te redujeron el sueldo sin acuerdo o no te registraron correctamente, evaluamos tu situación con la normativa vigente —incluida la reforma de la Ley 27.802— y te decimos con claridad si conviene reclamar, cuánto podrías cobrar y cuánto puede tardar.",
    imagen: "/img/firma.jpg",
    imagenAlt: "Mano firmando un documento sobre un escritorio",
    bullets: [
      "Despido con o sin causa",
      "Indemnización y liquidación final",
      "Trabajo no registrado o mal registrado",
      "Accidentes y enfermedades laborales (ART)",
      "Intercambio telegráfico y conciliación (SECLO)",
      "Asesoramiento preventivo a empleadores",
    ],
    pasos: [
      { titulo: "Revisamos tu recibo y el telegrama", texto: "Con esos dos papeles ya podemos estimar tu indemnización." },
      { titulo: "Intimamos por escrito", texto: "Redactamos el telegrama o carta documento en tiempo y forma." },
      { titulo: "Conciliación obligatoria", texto: "La mayoría de los casos se cierra en la instancia del SECLO." },
      { titulo: "Juicio, si hace falta", texto: "Si no hay acuerdo razonable, iniciamos la demanda laboral." },
    ],
    faqs: [
      {
        pregunta: "¿Cuánto tarda un reclamo laboral?",
        respuesta:
          "Depende de si se resuelve por acuerdo o llega a juicio. Un acuerdo en el SECLO puede cerrarse en semanas; un juicio laboral puede llevar más de un año.",
      },
      {
        pregunta: "¿Tiene costo la primera consulta?",
        respuesta:
          "No. La evaluación inicial de tu caso no tiene costo y te respondemos dentro de las 48 horas hábiles.",
      },
      {
        pregunta: "¿Qué pasa si no tengo el despido por escrito?",
        respuesta:
          "Igual se puede reclamar. Hay formas de acreditar la relación laboral y el despido aunque no haya telegrama; por eso es clave actuar rápido.",
      },
      {
        pregunta: "¿Qué cambió con la reforma laboral de 2026?",
        respuesta:
          "La Ley 27.802 modificó, entre otras cosas, la base de cálculo de la indemnización del art. 245 (excluye aguinaldo, vacaciones y premios no mensuales). Cada caso se analiza según la fecha del despido y la norma aplicable.",
      },
    ],
  },
  {
    slug: "familia",
    numero: "02",
    nombre: "Derecho de Familia",
    titular: "Acuerdos cuando se puede. Firmeza cuando no.",
    descripcionCorta:
      "Divorcios, cuota alimentaria, cuidado personal y régimen de comunicación, con un enfoque humano y directo.",
    descripcionLarga:
      "Acompañamos divorcios, cuota alimentaria y régimen de comunicación con los hijos priorizando acuerdos rápidos y sostenibles. Cuando no hay acuerdo posible, defendemos tu posición con firmeza ante el juzgado.",
    imagen: "/img/familia.jpg",
    imagenAlt: "Un adulto y un niño suben juntos una escalinata, en blanco y negro",
    bullets: [
      "Divorcio unilateral o de común acuerdo",
      "Cuota alimentaria: fijación, aumento y cobro",
      "Cuidado personal y régimen de comunicación",
      "Uniones convivenciales y división de bienes",
      "Violencia familiar: medidas urgentes",
      "Mediación prejudicial obligatoria",
    ],
    pasos: [
      { titulo: "Escuchamos el contexto completo", texto: "Primero entendemos qué necesitás proteger: hijos, vivienda, ingresos." },
      { titulo: "Propuesta reguladora", texto: "Armamos la propuesta de acuerdo que exige el Código Civil y Comercial." },
      { titulo: "Mediación", texto: "Buscamos cerrar un acuerdo que evite años de conflicto." },
      { titulo: "Proceso judicial", texto: "Si no hay acuerdo, llevamos el caso ante el juzgado de familia." },
    ],
    faqs: [
      {
        pregunta: "¿Necesito que la otra parte esté de acuerdo para divorciarme?",
        respuesta:
          "No. Desde 2015 el divorcio en Argentina puede pedirlo uno solo de los cónyuges, sin expresar causa ni esperar plazos. Solo hay que acompañar una propuesta sobre los efectos del divorcio.",
      },
      {
        pregunta: "¿Cómo se calcula la cuota alimentaria?",
        respuesta:
          "Se evalúan los ingresos de quien debe pagarla y las necesidades reales de los hijos (alimentación, educación, salud, vivienda). No hay un porcentaje fijo por ley.",
      },
      {
        pregunta: "¿Qué hago si no me pasan la cuota?",
        respuesta:
          "Se puede reclamar judicialmente el pago, con intereses, y pedir medidas como embargo de sueldo o inscripción en el registro de deudores alimentarios.",
      },
    ],
  },
  {
    slug: "penal",
    numero: "03",
    nombre: "Derecho Penal",
    titular: "Las primeras horas definen el caso.",
    descripcionCorta:
      "Defensa penal y asesoramiento urgente ante una denuncia, citación o detención. Guardia 24 h.",
    descripcionLarga:
      "Si estás siendo investigado, recibiste una citación o un familiar fue detenido, lo primero es no declarar sin asesoramiento. Nuestra guardia penal responde las 24 horas para definir los pasos inmediatos.",
    imagen: "/img/columnas.jpg",
    imagenAlt: "Columnas neoclásicas de un edificio judicial con sombras marcadas",
    bullets: [
      "Defensa técnica en causas penales",
      "Asistencia en indagatorias",
      "Excarcelaciones y exenciones de prisión",
      "Querellas: representación de la víctima",
      "Delitos económicos y penal tributario",
      "Guardia 24 h ante detenciones",
    ],
    pasos: [
      { titulo: "Contacto inmediato", texto: "Nuestra guardia responde por WhatsApp a cualquier hora." },
      { titulo: "Acceso a la causa", texto: "Tomamos vista del expediente para saber de qué se acusa y con qué pruebas." },
      { titulo: "Estrategia de defensa", texto: "Definimos si conviene declarar, qué pedir y en qué orden." },
      { titulo: "Acompañamiento en cada audiencia", texto: "Estamos presentes en cada instancia, hasta la sentencia." },
    ],
    faqs: [
      {
        pregunta: "Me citaron a indagatoria, ¿qué hago?",
        respuesta:
          "Contactanos antes de presentarte. Tenés derecho a no declarar y a hacerlo recién cuando tu defensa conozca la causa. Preparar la declaración es clave.",
      },
      {
        pregunta: "¿Atienden casos urgentes fuera de horario?",
        respuesta:
          "Sí. Para detenciones o plazos urgentes tenemos una guardia penal que responde las 24 horas por WhatsApp.",
      },
      {
        pregunta: "¿Puedo ser querellante si fui víctima de un delito?",
        respuesta:
          "Sí. Como querellante podés impulsar la investigación, proponer pruebas y participar activamente del proceso con tu abogado.",
      },
    ],
  },
  {
    slug: "comercial",
    numero: "04",
    nombre: "Derecho Comercial",
    titular: "Contratos que previenen juicios.",
    descripcionCorta:
      "Contratos, sociedades, conflictos entre socios y cobro de deudas para pymes y emprendedores.",
    descripcionLarga:
      "Asesoramos a pymes y emprendedores en la redacción de contratos, la constitución de sociedades y la resolución de conflictos comerciales antes de que escalen a un juicio largo y costoso.",
    imagen: "/img/sala-reuniones.jpg",
    imagenAlt: "Sala de reuniones con mesa de madera y sillas de cuero",
    bullets: [
      "Redacción y revisión de contratos",
      "Constitución de sociedades (SAS, SRL, SA)",
      "Pactos de socios y conflictos societarios",
      "Cobro de deudas y ejecuciones",
      "Defensa del consumidor (empresas)",
      "Concursos y reestructuración de deudas",
    ],
    pasos: [
      { titulo: "Diagnóstico", texto: "Revisamos contratos, estatutos y el estado actual del conflicto." },
      { titulo: "Mapa de riesgos", texto: "Te mostramos qué puede salir mal y cuánto costaría." },
      { titulo: "Negociación", texto: "Buscamos la salida más rápida y rentable para tu empresa." },
      { titulo: "Litigio", texto: "Si no hay acuerdo, defendemos tus intereses ante la justicia comercial." },
    ],
    faqs: [
      {
        pregunta: "¿Revisan contratos ya firmados?",
        respuesta:
          "Sí. Evaluamos contratos vigentes para identificar riesgos, cláusulas abusivas y posibles reclamos.",
      },
      {
        pregunta: "¿Qué tipo de sociedad me conviene?",
        respuesta:
          "Depende de la cantidad de socios, el capital, la actividad y los planes de crecimiento. Lo analizamos con vos y te recomendamos la figura más simple que te proteja.",
      },
    ],
  },
  {
    slug: "sucesiones",
    numero: "05",
    nombre: "Sucesiones",
    titular: "Ordenar lo que queda, cuidando a los que quedan.",
    descripcionCorta:
      "Trámites sucesorios completos, testamentos y sucesiones con conflicto entre herederos.",
    descripcionLarga:
      "Iniciamos y llevamos adelante el trámite sucesorio completo —desde la declaratoria de herederos hasta la inscripción de los bienes— y representamos a herederos cuando hay desacuerdos sobre la partición.",
    imagen: "/img/sucesiones.jpg",
    imagenAlt: "Una mano sostiene fotografías familiares antiguas",
    bullets: [
      "Inicio de sucesión y declaratoria de herederos",
      "Inscripción y venta de inmuebles heredados",
      "Partición de bienes",
      "Sucesiones con conflicto entre herederos",
      "Testamentos y planificación sucesoria",
      "Sucesiones con bienes en otras provincias",
    ],
    pasos: [
      { titulo: "Reunimos la documentación", texto: "Partidas, títulos y datos de bienes: te damos la lista exacta." },
      { titulo: "Iniciamos el juicio sucesorio", texto: "Ante el juzgado del último domicilio de la persona fallecida." },
      { titulo: "Declaratoria de herederos", texto: "El juez reconoce quiénes heredan." },
      { titulo: "Inscripción o venta", texto: "Inscribimos los bienes o acompañamos la venta." },
    ],
    faqs: [
      {
        pregunta: "¿Cuánto tarda una sucesión?",
        respuesta:
          "Una sucesión sin conflicto suele resolverse en varios meses; con desacuerdos entre herederos puede extenderse. Te damos un estimado real según tu caso.",
      },
      {
        pregunta: "¿Es obligatorio hacer la sucesión?",
        respuesta:
          "No hay un plazo legal, pero sin sucesión no se pueden vender, inscribir ni disponer los bienes. Postergarla suele encarecer el trámite.",
      },
    ],
  },
];

export const equipo: Abogado[] = [
  {
    slug: "ernesto-iturbe",
    nombre: "Dr. Ernesto Iturbe",
    cargo: "Socio fundador",
    areas: ["penal", "comercial"],
    matricula: "T° 21 F° 344 CPACF",
    formacion: "Abogado (UBA, 1981). Especialista en Derecho Penal Económico.",
    bio: "Fundó el estudio en 1987 con una sola causa laboral y un despacho frente a Tribunales. Casi cuatro décadas después sigue revisando personalmente cada estrategia de defensa penal.",
    foto: "/img/equipo/fundador.jpg",
    socio: true,
  },
  {
    slug: "mercedes-lavalle",
    nombre: "Dra. Mercedes Lavalle",
    cargo: "Socia",
    areas: ["familia", "sucesiones"],
    matricula: "T° 48 F° 102 CPACF",
    formacion: "Abogada (UCA). Mediadora prejudicial registrada.",
    bio: "Se sumó en 1994 y creó el área de Familia. Cree que el mejor juicio de familia es el que se evita, y que cuando no se puede evitar, hay que ganarlo.",
    foto: "/img/equipo/socia-familia.jpg",
    socio: true,
  },
  {
    slug: "julian-arce",
    nombre: "Dr. Julián Arce",
    cargo: "Socio director",
    areas: ["comercial"],
    matricula: "T° 67 F° 519 CPACF",
    formacion: "Abogado (UBA). Máster en Derecho Empresario (Universidad Austral).",
    bio: "Dirige el área comercial y la gestión del estudio. Asesora a pymes familiares en contratos, sociedades y conflictos entre socios.",
    foto: "/img/equipo/socio-director.jpg",
    socio: true,
  },
  {
    slug: "valeria-sosa",
    nombre: "Dra. Valeria Sosa",
    cargo: "Socia",
    areas: ["laboral"],
    matricula: "T° 88 F° 230 CPACF",
    formacion: "Abogada (UBA). Especialista en Derecho del Trabajo.",
    bio: "Lleva más de 1.500 reclamos laborales. Conoce el SECLO por dentro y negocia cada acuerdo como si fuera propio.",
    foto: "/img/equipo/laboral.jpg",
    socio: true,
  },
  {
    slug: "martin-ocampo",
    nombre: "Dr. Martín Ocampo",
    cargo: "Asociado senior",
    areas: ["penal"],
    matricula: "T° 102 F° 455 CPACF",
    formacion: "Abogado (UBA). Docente de Derecho Procesal Penal.",
    bio: "Coordina la guardia penal 24 h. Es quien atiende el teléfono a las tres de la mañana cuando alguien necesita un defensor.",
    foto: "/img/equipo/penal.jpg",
    socio: false,
  },
  {
    slug: "tomas-ferreyra",
    nombre: "Dr. Tomás Ferreyra",
    cargo: "Asociado",
    areas: ["comercial", "sucesiones"],
    matricula: "T° 121 F° 087 CPACF",
    formacion: "Abogado (UTDT).",
    bio: "Redacta contratos pensando en el juicio que buscan evitar. También acompaña sucesiones con inmuebles en varias jurisdicciones.",
    foto: "/img/equipo/comercial.jpg",
    socio: false,
  },
  {
    slug: "lucia-benitez",
    nombre: "Dra. Lucía Benítez",
    cargo: "Asociada",
    areas: ["laboral", "familia"],
    matricula: "T° 130 F° 612 CPACF",
    formacion: "Abogada (UBA).",
    bio: "Responde la mayoría de las consultas iniciales: si escribís al estudio, probablemente sea ella quien lea tu caso primero.",
    foto: "/img/equipo/asociada.jpg",
    socio: false,
  },
];

export const historia: Hito[] = [
  {
    anio: "1987",
    titulo: "Un despacho, una Olivetti, una causa",
    texto:
      "Ernesto Iturbe alquila dos ambientes sobre Talcahuano, frente a Tribunales. La primera causa es un despido: se cobró completa, y el cliente volvió con su hermano.",
    imagen: "/img/maquina.jpg",
    imagenAlt: "Máquina de escribir antigua sobre una mesa de madera",
  },
  {
    anio: "1994",
    titulo: "Llega Mercedes Lavalle",
    texto:
      "Con ella nace el área de Familia y el estudio adopta su nombre actual. Ocupamos el piso completo del mismo edificio.",
    imagen: "/img/sede-avenida.jpg",
    imagenAlt: "Edificio histórico de Buenos Aires al atardecer",
  },
  {
    anio: "2002",
    titulo: "El año de los amparos",
    texto:
      "Durante el corralito presentamos cientos de amparos para que ahorristas recuperaran sus depósitos. Aprendimos a trabajar bajo presión sin perder el trato personal.",
    imagen: "/img/escalinata.jpg",
    imagenAlt: "Escalinata de mármol entre columnas clásicas",
  },
  {
    anio: "2015",
    titulo: "Nuevo Código, nuevas reglas",
    texto:
      "Entra en vigencia el Código Civil y Comercial. Rediseñamos Familia y Sucesiones: divorcio sin causa, uniones convivenciales y nuevas reglas de herencia.",
    imagen: "/img/libros.jpg",
    imagenAlt: "Pila de libros antiguos encuadernados en cuero",
  },
  {
    anio: "2020",
    titulo: "El estudio, en tu teléfono",
    texto:
      "En diez días pasamos a atención 100 % digital. Desde entonces, la mitad de nuestras primeras consultas empieza por WhatsApp.",
    imagen: "/img/pluma.jpg",
    imagenAlt: "Pluma estilográfica escribiendo sobre papel rayado",
  },
  {
    anio: "Hoy",
    titulo: "Siete abogados, la misma dirección",
    texto:
      "Cinco áreas de práctica, una guardia penal 24 h y la misma puerta en Talcahuano 638. Cambió todo, menos la forma de atender.",
    imagen: "/img/biblioteca.jpg",
    imagenAlt: "Gran sala de biblioteca con arañas y mesas de lectura",
  },
];

export const testimonios: Testimonio[] = [
  {
    expediente: "0412/23",
    tipoDeCaso: "Despido sin causa",
    texto:
      "La empresa me ofrecía menos de la mitad. Me explicaron en una tarde lo que me correspondía y cerramos en el SECLO por el total.",
    resultado: "Acuerdo por el 100 % de la liquidación",
    areaSlug: "laboral",
    anio: 2023,
  },
  {
    expediente: "1187/22",
    tipoDeCaso: "Divorcio con hijos menores",
    texto:
      "Tenía miedo de que fuera una guerra. Lograron un acuerdo de cuidado compartido que hoy, dos años después, sigue funcionando.",
    resultado: "Convenio homologado en mediación",
    areaSlug: "familia",
    anio: 2022,
  },
  {
    expediente: "0098/24",
    tipoDeCaso: "Conflicto entre socios",
    texto:
      "Llevábamos un año sin poder hablar entre socios. Nos sentaron en una mesa y salimos con un acuerdo de salida justo para los dos.",
    resultado: "Acuerdo de salida sin juicio",
    areaSlug: "comercial",
    anio: 2024,
  },
  {
    expediente: "2231/21",
    tipoDeCaso: "Detención de un familiar",
    texto:
      "Llamé a las dos de la mañana y me atendieron. A las once, mi hijo estaba en casa. No me voy a olvidar nunca.",
    resultado: "Excarcelación en 9 horas",
    areaSlug: "penal",
    anio: 2021,
  },
  {
    expediente: "0765/23",
    tipoDeCaso: "Sucesión con tres herederos",
    texto:
      "Éramos tres hermanos que no nos poníamos de acuerdo en nada. Ordenaron todo y pudimos vender la casa de nuestros padres sin pelearnos.",
    resultado: "Partición y venta en 7 meses",
    areaSlug: "sucesiones",
    anio: 2023,
  },
  {
    expediente: "1520/24",
    tipoDeCaso: "Trabajo no registrado",
    texto:
      "Trabajé cuatro años en negro. Pensé que no tenía cómo probarlo, pero con mensajes y testigos lograron que me reconocieran toda la antigüedad.",
    resultado: "Reconocimiento de antigüedad total",
    areaSlug: "laboral",
    anio: 2024,
  },
];

export const notas: Nota[] = [
  {
    slug: "reforma-laboral-2026-que-cambia-si-te-despiden",
    titulo: "Reforma laboral 2026: qué cambia (y qué no) si te despiden",
    bajada:
      "La Ley 27.802 modificó la base de cálculo de la indemnización y el período de prueba. Te explicamos en qué te afecta, sin tecnicismos.",
    categoria: "Laboral",
    areaSlug: "laboral",
    fecha: "2026-04-14",
    lectura: "6 min",
    autor: "Dra. Valeria Sosa",
    imagen: "/img/firma.jpg",
    imagenAlt: "Mano firmando un documento",
    cuerpo: [
      {
        parrafos: [
          "En marzo de 2026 se publicó en el Boletín Oficial la Ley 27.802 de Modernización Laboral. Es la segunda reforma importante en dos años, después de la Ley 27.742 de 2024, y cambia algunas reglas que conviene conocer antes de firmar cualquier papel.",
        ],
      },
      {
        subtitulo: "Qué cambió",
        parrafos: [
          "La base de la indemnización por antigüedad (art. 245 de la Ley de Contrato de Trabajo) sigue siendo la mejor remuneración mensual, normal y habitual, pero ahora la ley excluye expresamente el aguinaldo, las vacaciones y los premios o bonos que no se pagan todos los meses.",
          "Para los conceptos variables —comisiones, horas extra, premios mensuales— se toma el promedio de los últimos seis meses, o del último año si es más favorable, en lugar del mejor mes.",
          "El período de prueba es de seis meses. Durante ese tiempo el empleador puede terminar la relación sin indemnización por antigüedad.",
        ],
      },
      {
        subtitulo: "Qué no cambió",
        parrafos: [
          "Se sigue cobrando un mes de sueldo por cada año trabajado o fracción mayor de tres meses. El preaviso y la integración del mes de despido siguen vigentes, y la liquidación final (días trabajados, aguinaldo y vacaciones proporcionales) se debe siempre, cualquiera sea la causa del despido.",
        ],
      },
      {
        subtitulo: "Qué hacer si te despiden hoy",
        parrafos: [
          "No firmes nada sin leerlo, guardá tus recibos y cualquier mensaje o mail con tu empleador, y consultá antes de responder un telegrama: los plazos son cortos y un error en la respuesta puede costar caro.",
          "Podés usar nuestra calculadora para tener una primera estimación, pero cada caso depende del convenio colectivo, la fecha del despido y la norma aplicable.",
        ],
      },
    ],
  },
  {
    slug: "divorcio-sin-acuerdo-como-funciona",
    titulo: "Divorcio sin acuerdo de la otra parte: cómo funciona",
    bajada:
      "Desde 2015 alcanza con que uno de los dos quiera divorciarse. Pero hay una condición que muchos desconocen.",
    categoria: "Familia",
    areaSlug: "familia",
    fecha: "2026-02-03",
    lectura: "4 min",
    autor: "Dra. Mercedes Lavalle",
    imagen: "/img/familia.jpg",
    imagenAlt: "Adulto y niño subiendo una escalinata",
    cuerpo: [
      {
        parrafos: [
          "El Código Civil y Comercial, vigente desde agosto de 2015, eliminó las causales de divorcio y los plazos de espera. Hoy cualquiera de los cónyuges puede pedir el divorcio sin explicar por qué y sin el consentimiento del otro.",
        ],
      },
      {
        subtitulo: "La propuesta reguladora",
        parrafos: [
          "La condición es acompañar una propuesta sobre los efectos del divorcio: quién se queda en la vivienda, cómo se reparten los bienes, el cuidado de los hijos y la cuota alimentaria. Si no se presenta, el pedido no avanza.",
          "La otra parte puede aceptar la propuesta o presentar la suya. Si no hay acuerdo, el juez igual dicta el divorcio y las cuestiones pendientes se resuelven por separado.",
        ],
      },
      {
        subtitulo: "Por qué conviene asesorarse antes",
        parrafos: [
          "La propuesta reguladora marca el punto de partida de toda la negociación. Una propuesta bien armada protege a los hijos y evita años de conflicto; una improvisada puede dejarte en desventaja.",
        ],
      },
    ],
  },
  {
    slug: "sucesion-primeros-pasos",
    titulo: "Sucesión: los primeros cinco pasos",
    bajada:
      "Qué documentos reunir, dónde se inicia y cuánto puede tardar el trámite sucesorio en la Ciudad de Buenos Aires.",
    categoria: "Sucesiones",
    areaSlug: "sucesiones",
    fecha: "2025-11-20",
    lectura: "5 min",
    autor: "Dr. Tomás Ferreyra",
    imagen: "/img/sucesiones.jpg",
    imagenAlt: "Fotografías familiares antiguas",
    cuerpo: [
      {
        parrafos: [
          "Perder a un familiar ya es suficientemente difícil. Ordenar los papeles no tiene por qué serlo. Estos son los pasos básicos de cualquier sucesión.",
        ],
      },
      {
        subtitulo: "1. Reunir las partidas",
        parrafos: [
          "La partida de defunción y las que acreditan el vínculo con la persona fallecida: matrimonio, nacimiento de los hijos.",
        ],
      },
      {
        subtitulo: "2. Hacer una lista de bienes",
        parrafos: [
          "Inmuebles, autos, cuentas bancarias, participaciones en sociedades. No hace falta tener todos los títulos: los podemos pedir nosotros.",
        ],
      },
      {
        subtitulo: "3. Iniciar el juicio sucesorio",
        parrafos: [
          "Se inicia ante el juez del último domicilio de la persona fallecida. Si había testamento, se presenta en esta etapa.",
        ],
      },
      {
        subtitulo: "4. Declaratoria de herederos",
        parrafos: [
          "Es la resolución en la que el juez reconoce quiénes son los herederos. Sin conflictos, suele llegar en pocos meses.",
        ],
      },
      {
        subtitulo: "5. Inscribir o vender",
        parrafos: [
          "Con la declaratoria se inscriben los bienes a nombre de los herederos o se autoriza su venta. Los costos incluyen tasa de justicia, aportes y honorarios, que te informamos por escrito desde el inicio.",
        ],
      },
    ],
  },
];

export const faqsGenerales: Faq[] = [
  {
    pregunta: "¿Cuánto cuesta la primera consulta?",
    respuesta:
      "La evaluación inicial de tu caso no tiene costo. Si decidís avanzar, te pasamos los honorarios por escrito antes de empezar.",
  },
  {
    pregunta: "¿Atienden en persona o solo online?",
    respuesta:
      "Las dos cosas. Podés venir a Talcahuano 638 con turno previo o resolver todo por videollamada y WhatsApp.",
  },
  {
    pregunta: "¿Cómo se cobran los honorarios?",
    respuesta:
      "Depende del caso: en reclamos laborales solemos trabajar con un porcentaje del resultado; en otras áreas, con honorarios fijos o por etapa. Siempre por escrito.",
  },
  {
    pregunta: "¿Atienden fuera de la Ciudad de Buenos Aires?",
    respuesta:
      "Sí. Trabajamos en CABA y Provincia de Buenos Aires, y con estudios corresponsales en el resto del país.",
  },
];

export function getAreaBySlug(slug: string): AreaDePractica | undefined {
  return areasDePractica.find((area) => area.slug === slug);
}

export function getTestimoniosByAreaSlug(areaSlug: string): Testimonio[] {
  return testimonios.filter((t) => t.areaSlug === areaSlug);
}
