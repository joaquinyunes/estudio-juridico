import { defineField, defineType } from "sanity";

/** Preguntas frecuentes generales (las de cada área se cargan dentro del área). */
export default defineType({
  name: "faqGeneral",
  title: "Pregunta frecuente",
  type: "document",
  fields: [
    defineField({ name: "pregunta", title: "Pregunta", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "respuesta",
      title: "Respuesta",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "orden",
      title: "Orden",
      type: "number",
      description: "Menor número aparece primero.",
      initialValue: 10,
    }),
  ],
  orderings: [{ title: "Orden", name: "orden", by: [{ field: "orden", direction: "asc" }] }],
  preview: { select: { title: "pregunta", subtitle: "respuesta" } },
});
