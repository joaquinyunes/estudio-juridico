import { defineField, defineType } from "sanity";

export default defineType({
  name: "areaDePractica",
  title: "Área de práctica",
  type: "document",
  fields: [
    defineField({ name: "nombre", title: "Nombre", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "nombre" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "descripcionCorta",
      title: "Descripción corta (para meta description / cards)",
      type: "string",
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: "descripcionLarga",
      title: "Descripción larga",
      type: "text",
    }),
    defineField({
      name: "bullets",
      title: "Qué resolvemos (bullets)",
      type: "array",
      of: [{ type: "string" }],
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
            { name: "pregunta", type: "string" },
            { name: "respuesta", type: "text" },
          ],
        },
      ],
    }),
  ],
});
