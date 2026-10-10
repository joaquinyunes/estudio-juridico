import { defineField, defineType } from "sanity";

export default defineType({
  name: "datosDelEstudio",
  title: "Datos del estudio",
  type: "document",
  fields: [
    defineField({ name: "nombre", title: "Nombre del estudio", type: "string" }),
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
