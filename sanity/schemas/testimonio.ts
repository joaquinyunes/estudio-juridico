import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonio",
  title: "Testimonio (anonimizado)",
  type: "document",
  fields: [
    defineField({
      name: "tipoDeCaso",
      title: "Tipo de caso resuelto",
      type: "string",
      description: "Ej: 'Despido sin causa'. Nunca incluir nombres reales.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "texto",
      title: "Testimonio",
      type: "text",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "area",
      title: "Área de práctica",
      type: "reference",
      to: [{ type: "areaDePractica" }],
    }),
  ],
});
