import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { documentosUnicos, schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const esUnico = (tipo: string) => (documentosUnicos as readonly string[]).includes(tipo);

export default defineConfig({
  name: "estudio-juridico",
  title: "Panel — Estudio Jurídico",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      // Menú en orden de uso: lo que cambia mes a mes primero.
      structure: (S) =>
        S.list()
          .title("Contenido del sitio")
          .items([
            S.listItem()
              .title("Aviso del sitio")
              .id("aviso")
              .child(S.document().schemaType("aviso").documentId("aviso")),
            S.documentTypeListItem("nota").title("Notas y novedades"),
            S.documentTypeListItem("testimonio").title("Casos resueltos"),
            S.documentTypeListItem("faqGeneral").title("Preguntas frecuentes"),
            S.divider(),
            S.documentTypeListItem("abogado").title("Equipo"),
            S.documentTypeListItem("areaDePractica").title("Áreas de práctica"),
            S.listItem()
              .title("Datos del estudio y cifras")
              .id("datosDelEstudio")
              .child(S.document().schemaType("datosDelEstudio").documentId("datosDelEstudio")),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // Los documentos únicos no se pueden crear de nuevo desde el menú "+".
    templates: (templates) => templates.filter(({ schemaType }) => !esUnico(schemaType)),
  },
  document: {
    actions: (acciones, { schemaType }) =>
      esUnico(schemaType)
        ? acciones.filter(({ action }) => action && !["duplicate", "delete"].includes(action))
        : acciones,
  },
});
