import { defineField, defineType } from "sanity";

export default defineType({
  name: "abogado",
  title: "Integrante del equipo",
  type: "document",
  fields: [
    defineField({ name: "nombre", title: "Nombre (con Dr./Dra.)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "nombre" } }),
    defineField({ name: "cargo", title: "Cargo", type: "string", description: "Socio, Asociada, etc." }),
    defineField({ name: "socio", title: "¿Es socio/a?", type: "boolean", initialValue: false }),
    defineField({ name: "orden", title: "Orden", type: "number" }),
    defineField({
      name: "areas",
      title: "Áreas",
      type: "array",
      of: [{ type: "reference", to: [{ type: "areaDePractica" }] }],
    }),
    defineField({ name: "matricula", title: "Matrícula", type: "string", description: "Ej.: T° 21 F° 344 CPACF" }),
    defineField({ name: "formacion", title: "Formación", type: "string" }),
    defineField({ name: "bio", title: "Biografía breve", type: "text", rows: 3 }),
    defineField({ name: "foto", title: "Foto", type: "image", options: { hotspot: true } }),
  ],
  preview: { select: { title: "nombre", subtitle: "cargo", media: "foto" } },
});
