import { defineField, defineType } from "sanity";

/** Consultas recibidas por el formulario calificador (las crea /api/lead). */
export default defineType({
  name: "lead",
  title: "Consulta recibida",
  type: "document",
  fields: [
    defineField({ name: "nombre", title: "Nombre", type: "string", readOnly: true }),
    defineField({ name: "areaNombre", title: "Área", type: "string", readOnly: true }),
    defineField({ name: "area", title: "Área (slug)", type: "string", readOnly: true, hidden: true }),
    defineField({
      name: "urgencia",
      title: "Urgencia",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Plazo esta semana", value: "inmediata" },
          { title: "Este mes", value: "mes" },
          { title: "Informativa", value: "informacion" },
        ],
      },
    }),
    defineField({ name: "resumen", title: "Resumen del caso", type: "text", readOnly: true }),
    defineField({ name: "recibido", title: "Recibido", type: "datetime", readOnly: true }),
    defineField({ name: "consentimientoEn", title: "Consentimiento dado el", type: "datetime", readOnly: true }),
    defineField({
      name: "estado",
      title: "Estado",
      type: "string",
      initialValue: "nuevo",
      options: {
        list: [
          { title: "Nuevo", value: "nuevo" },
          { title: "Contactado", value: "contactado" },
          { title: "Cliente", value: "cliente" },
          { title: "Descartado", value: "descartado" },
        ],
        layout: "radio",
      },
    }),
    defineField({ name: "notas", title: "Notas internas", type: "text" }),
  ],
  orderings: [{ title: "Más recientes", name: "recibido", by: [{ field: "recibido", direction: "desc" }] }],
  preview: { select: { title: "nombre", subtitle: "areaNombre" } },
});
