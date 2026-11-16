import { defineField, defineType } from "sanity";

export default defineType({
  name: "datosDelEstudio",
  title: "Datos del estudio",
  type: "document",
  fieldsets: [
    {
      name: "marca",
      title: "Marca del estudio",
      description: "Nombre largo, monograma, año, ciudad y fundador. Salen en el encabezado, el sello, el pie y la imagen al compartir el sitio.",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "textos",
      title: "Textos de la portada y del sitio",
      description:
        "Se pueden usar marcadores: {nombre} {fundador} {ciudad} {fundacion} {anios} {Anios} {abogados} {Abogados} {areas} {Areas}. «{Anios}» se completa solo con los años desde la fundación, en letras (ej.: Treinta y nueve). Un campo vacío usa el texto de respaldo.",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({ name: "nombre", title: "Nombre del estudio", type: "string" }),
    defineField({ name: "nombreLegal", title: "Nombre legal", type: "string", fieldset: "marca", description: "Ej.: Iturbe & Lavalle — Abogados" }),
    defineField({ name: "monograma", title: "Monograma", type: "string", fieldset: "marca", description: "Las iniciales del sello y del logo. Ej.: I&L", validation: (r) => r.max(4) }),
    defineField({ name: "fundacion", title: "Año de fundación", type: "number", fieldset: "marca", validation: (r) => r.integer().min(1800).max(2100) }),
    defineField({ name: "fundador", title: "Fundador o fundadora", type: "string", fieldset: "marca", description: "Ej.: Ernesto Iturbe" }),
    defineField({ name: "ciudad", title: "Ciudad (nombre corto)", type: "string", fieldset: "marca", description: "Ej.: Buenos Aires" }),
    defineField({ name: "siglaCiudad", title: "Sigla de la ciudad", type: "string", fieldset: "marca", description: "Ej.: CABA. Va después de la dirección." }),
    defineField({ name: "localidad", title: "Localidad completa", type: "string", fieldset: "marca", description: "Ej.: Ciudad Autónoma de Buenos Aires" }),
    defineField({ name: "provincia", title: "Provincia", type: "string", fieldset: "marca", description: "Ej.: Provincia de Buenos Aires" }),
    defineField({ name: "referenciaCorta", title: "Referencia corta de la dirección", type: "string", fieldset: "marca", description: "Ej.: Frente a Tribunales" }),
    defineField({ name: "descripcionSitio", title: "Descripción del sitio (Google)", type: "text", rows: 3, fieldset: "textos" }),
    defineField({ name: "heroBajada", title: "Portada: texto bajo el titular", type: "text", rows: 3, fieldset: "textos" }),
    defineField({ name: "estudioTitulo", title: "«El estudio»: título", type: "string", fieldset: "textos" }),
    defineField({ name: "estudioTituloEnfasis", title: "«El estudio»: final del título (en cursiva)", type: "string", fieldset: "textos" }),
    defineField({ name: "estudioParrafo", title: "«El estudio»: párrafo", type: "text", rows: 6, fieldset: "textos" }),
    defineField({ name: "historiaTitulo", title: "«Historia»: título", type: "string", fieldset: "textos" }),
    defineField({ name: "historiaTituloEnfasis", title: "«Historia»: final del título (en cursiva)", type: "string", fieldset: "textos" }),
    defineField({ name: "historiaBajada", title: "«Historia»: bajada", type: "text", rows: 2, fieldset: "textos" }),
    defineField({ name: "equipoTitulo", title: "Equipo: título", type: "string", fieldset: "textos" }),
    defineField({ name: "equipoTituloEnfasis", title: "Equipo: final del título (en cursiva)", type: "string", fieldset: "textos" }),
    defineField({ name: "contactoDescripcion", title: "Contacto: descripción (Google)", type: "text", rows: 3, fieldset: "textos" }),
    defineField({ name: "horarios", title: "Horarios de atención", type: "string", description: "Ej.: Lunes a viernes de 9 a 18 h" }),
    defineField({ name: "guardia", title: "Texto de la guardia", type: "string", description: "Ej.: Guardia penal 24 h por WhatsApp" }),
    defineField({ name: "direccion", title: "Dirección", type: "string" }),
    defineField({ name: "referencia", title: "Referencia de la dirección", type: "string", description: "Ej.: Frente al Palacio de Tribunales" }),
    defineField({ name: "telefono", title: "Teléfono", type: "string" }),
    defineField({ name: "telefonoWhatsapp", title: "Número de WhatsApp (con código de país, sin +)", type: "string" }),
    defineField({ name: "email", title: "Email de contacto", type: "string" }),
    defineField({
      name: "cifras",
      title: "Cifras de la portada",
      description: "Hasta 4 números destacados. Se muestran en el orden en que los cargues.",
      type: "array",
      validation: (r) => r.max(4),
      of: [
        {
          type: "object",
          name: "cifra",
          fields: [
            defineField({ name: "valor", title: "Número", type: "string", description: "Ej.: 39 o 4.200", validation: (r) => r.required() }),
            defineField({ name: "unidad", title: "Unidad", type: "string", description: "Ej.: años, +, h" }),
            defineField({ name: "texto", title: "Descripción", type: "string", validation: (r) => r.required() }),
          ],
          preview: {
            select: { valor: "valor", unidad: "unidad", texto: "texto" },
            prepare: ({ valor, unidad, texto }) => ({ title: `${valor ?? ""} ${unidad ?? ""}`.trim(), subtitle: texto }),
          },
        },
      ],
    }),
  ],
});
