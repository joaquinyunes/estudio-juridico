import { defineField, defineType } from "sanity";

export default defineType({
  name: "nota",
  title: "Nota / artículo",
  type: "document",
  fields: [
    defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "titulo" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "bajada", title: "Bajada", type: "text", rows: 2, validation: (r) => r.max(220) }),
    defineField({ name: "categoria", title: "Categoría", type: "string" }),
    defineField({ name: "area", title: "Área relacionada", type: "reference", to: [{ type: "areaDePractica" }] }),
    defineField({ name: "autor", title: "Autor/a", type: "reference", to: [{ type: "abogado" }] }),
    defineField({ name: "fecha", title: "Fecha", type: "date", validation: (r) => r.required() }),
    defineField({ name: "lectura", title: "Tiempo de lectura", type: "string", description: "Ej.: 5 min" }),
    defineField({
      name: "imagen",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Texto alternativo", type: "string" })],
    }),
    defineField({
      name: "cuerpo",
      title: "Cuerpo",
      type: "array",
      of: [
        {
          type: "object",
          name: "bloque",
          fields: [
            { name: "subtitulo", title: "Subtítulo (opcional)", type: "string" },
            { name: "parrafos", title: "Párrafos", type: "array", of: [{ type: "text" }] },
          ],
          preview: { select: { title: "subtitulo" } },
        },
      ],
    }),
  ],
  orderings: [{ title: "Más recientes", name: "fecha", by: [{ field: "fecha", direction: "desc" }] }],
});
