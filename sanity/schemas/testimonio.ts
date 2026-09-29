import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonio",
  title: "Testimonio (anonimizado)",
  type: "document",
  fields: [
    defineField({
      name: "expediente",
      title: "N° de expediente interno",
      type: "string",
      description: "Ej.: 0412/23. Nunca el número de causa judicial real.",
    }),
    defineField({
      name: "tipoDeCaso",
      title: "Tipo de caso resuelto",
      type: "string",
      description: "Ej.: «Despido sin causa». Nunca incluir nombres reales.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "texto", title: "Testimonio", type: "text", validation: (r) => r.required() }),
    defineField({ name: "resultado", title: "Resultado", type: "string", description: "Ej.: «Acuerdo por el 100 %»" }),
    defineField({ name: "anio", title: "Año", type: "number" }),
    defineField({
      name: "area",
      title: "Área de práctica",
      type: "reference",
      to: [{ type: "areaDePractica" }],
    }),
  ],
  preview: { select: { title: "tipoDeCaso", subtitle: "resultado" } },
});
