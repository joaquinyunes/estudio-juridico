import { defineField, defineType } from "sanity";

/** Un hito de la línea de tiempo «Historia» de la portada. */
export default defineType({
  name: "hito",
  title: "Hito de la historia",
  type: "document",
  fields: [
    defineField({ name: "anio", title: "Año", type: "string", description: "Ej.: 1987", validation: (r) => r.required() }),
    defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
    defineField({ name: "texto", title: "Texto", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({
      name: "imagen",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Texto alternativo", type: "string" })],
    }),
    defineField({ name: "orden", title: "Orden", type: "number", description: "1 es el primero (el más antiguo)." }),
  ],
  orderings: [{ title: "Orden", name: "orden", by: [{ field: "orden", direction: "asc" }] }],
  preview: { select: { title: "titulo", subtitle: "anio" } },
});
