import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/**
 * `null` mientras no exista un proyecto de Sanity configurado (ver
 * PROGRESS.md). Las páginas hoy usan `src/lib/content.ts` como fuente de
 * datos; cuando se configure `NEXT_PUBLIC_SANITY_PROJECT_ID`, se migran a
 * queries GROQ contra este cliente.
 */
export const sanityClient = sanityProjectId
  ? createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: "2024-01-01",
      useCdn: true,
    })
  : null;

export function urlFor(source: Parameters<ReturnType<typeof imageUrlBuilder>["image"]>[0]) {
  if (!sanityClient) {
    throw new Error("Sanity no está configurado (falta NEXT_PUBLIC_SANITY_PROJECT_ID)");
  }
  return imageUrlBuilder(sanityClient).image(source);
}
