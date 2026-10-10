import { defineField, defineType } from "sanity";

/**
 * Cinta de aviso en la parte superior del sitio: novedades del mes, feria
 * judicial, cambios de horario, una nota nueva, etc. Documento único.
 */
export default defineType({
  name: "aviso",
  title: "Aviso del sitio",
  type: "document",
  fields: [
    defineField({
      name: "activo",
      title: "Mostrar el aviso",
      type: "boolean",
      initialValue: true,
      description: "Apagalo para ocultar el aviso sin borrarlo.",
    }),
    defineField({
      name: "etiqueta",
      title: "Etiqueta",
      type: "string",
      initialValue: "Novedad",
      description: "Palabra corta antes del texto. Ej.: Novedad, Aviso, Feria judicial.",
      validation: (r) => r.max(24),
    }),
    defineField({
      name: "texto",
      title: "Texto",
      type: "string",
      description: "Una sola frase, hasta 140 caracteres.",
      validation: (r) => r.required().max(140),
    }),
    defineField({
      name: "enlace",
      title: "Enlace (opcional)",
      type: "string",
      description: "Una página del sitio (/notas/mi-nota) o una dirección completa (https://…).",
      validation: (r) =>
        r.custom((valor) =>
          !valor || /^(\/|https?:\/\/)/.test(valor)
            ? true
            : "Tiene que empezar con / (página del sitio) o con https://",
        ),
    }),
    defineField({
      name: "enlaceTexto",
      title: "Texto del enlace",
      type: "string",
      initialValue: "Ver más",
      validation: (r) => r.max(24),
    }),
    defineField({
      name: "desde",
      title: "Mostrar desde (opcional)",
      type: "date",
      description: "Si lo dejás vacío, se muestra de inmediato.",
    }),
    defineField({
      name: "hasta",
      title: "Mostrar hasta (opcional)",
      type: "date",
      description: "El último día en que se muestra. Pasado ese día se oculta solo.",
    }),
  ],
  preview: {
    select: { title: "texto", activo: "activo", hasta: "hasta" },
    prepare: ({ title, activo, hasta }) => ({
      title: title || "Aviso sin texto",
      subtitle: `${activo ? "Visible" : "Oculto"}${hasta ? ` · hasta ${hasta}` : ""}`,
    }),
  },
});
