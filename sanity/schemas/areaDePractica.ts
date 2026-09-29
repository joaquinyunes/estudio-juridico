import { defineField, defineType } from "sanity";

export default defineType({
  name: "areaDePractica",
  title: "Área de práctica",
  type: "document",
  fields: [
    defineField({ name: "nombre", title: "Nombre", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Dirección web (slug)",
      type: "slug",
      options: { source: "nombre" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "numero",
      title: "Número de orden",
      type: "string",
      description: "Ej.: 01, 02… Define el orden en el sitio.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "titular",
      title: "Titular grande",
      type: "string",
      description: "Frase corta de la portada del área. Ej.: «Las primeras horas definen el caso.»",
    }),
    defineField({
      name: "descripcionCorta",
      title: "Descripción corta (buscadores y listados)",
      type: "string",
      validation: (r) => r.required().max(160),
    }),
    defineField({ name: "descripcionLarga", title: "Descripción larga", type: "text", rows: 4 }),
    defineField({
      name: "imagen",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Texto alternativo", type: "string" })],
    }),
    defineField({ name: "bullets", title: "Qué resolvemos", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "pasos",
      title: "Cómo lo llevamos adelante",
      type: "array",
      of: [
        {
          type: "object",
          name: "paso",
          fields: [
            { name: "titulo", title: "Título", type: "string" },
            { name: "texto", title: "Texto", type: "text", rows: 2 },
          ],
        },
      ],
    }),
    defineField({
      name: "faqs",
      title: "Preguntas frecuentes de esta área",
      type: "array",
      of: [
        {
          type: "object",
          name: "faq",
          fields: [
            { name: "pregunta", title: "Pregunta", type: "string" },
            { name: "respuesta", title: "Respuesta", type: "text" },
          ],
        },
      ],
    }),
  ],
  orderings: [{ title: "Orden", name: "numero", by: [{ field: "numero", direction: "asc" }] }],
});
