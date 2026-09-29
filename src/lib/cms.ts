import "server-only";
import { sanityClient } from "./sanity";
import * as local from "./content";
import type {
  Abogado,
  AreaDePractica,
  Nota,
  Testimonio,
} from "./content";

/**
 * Capa de datos única para las páginas.
 *
 * Con NEXT_PUBLIC_SANITY_PROJECT_ID configurado lee del panel de Sanity; si el
 * panel no está configurado, falla o todavía no tiene documentos de ese tipo,
 * devuelve el contenido de respaldo de `content.ts`. Así el sitio nunca queda
 * vacío durante la carga inicial de contenido.
 */

const REVALIDATE_SECONDS = 60;

async function fetchOr<T>(query: string, fallback: T, params = {}): Promise<T> {
  if (!sanityClient) return fallback;
  try {
    const data = await sanityClient.fetch<T>(query, params, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (data == null || (Array.isArray(data) && data.length === 0)) return fallback;
    return data;
  } catch (err) {
    console.error("Sanity no respondió; se usa el contenido de respaldo", err);
    return fallback;
  }
}

const areaProjection = `{
  "slug": slug.current,
  numero, nombre, titular, descripcionCorta, descripcionLarga,
  "imagen": coalesce(imagen.asset->url, "/img/biblioteca.jpg"),
  "imagenAlt": coalesce(imagen.alt, nombre),
  "bullets": coalesce(bullets, []),
  "pasos": coalesce(pasos[]{titulo, texto}, []),
  "faqs": coalesce(faqs[]{pregunta, respuesta}, [])
}`;

export function getAreas(): Promise<AreaDePractica[]> {
  return fetchOr(
    `*[_type == "areaDePractica"] | order(numero asc) ${areaProjection}`,
    local.areasDePractica,
  );
}

export async function getArea(slug: string): Promise<AreaDePractica | undefined> {
  const areas = await getAreas();
  return areas.find((a) => a.slug === slug);
}

export function getTestimonios(): Promise<Testimonio[]> {
  return fetchOr(
    `*[_type == "testimonio"] | order(anio desc) {
      expediente, tipoDeCaso, texto, resultado, anio,
      "areaSlug": area->slug.current
    }`,
    local.testimonios,
  );
}

export async function getTestimoniosDeArea(areaSlug: string): Promise<Testimonio[]> {
  return (await getTestimonios()).filter((t) => t.areaSlug === areaSlug);
}

export function getEquipo(): Promise<Abogado[]> {
  return fetchOr(
    `*[_type == "abogado"] | order(orden asc) {
      "slug": slug.current, nombre, cargo, matricula, formacion, bio, socio,
      "areas": coalesce(areas[]->slug.current, []),
      "foto": coalesce(foto.asset->url, "/img/equipo/asociada.jpg")
    }`,
    local.equipo,
  );
}

export function getNotas(): Promise<Nota[]> {
  return fetchOr(
    `*[_type == "nota"] | order(fecha desc) {
      "slug": slug.current, titulo, bajada, categoria, fecha, lectura,
      "areaSlug": area->slug.current,
      "autor": autor->nombre,
      "imagen": coalesce(imagen.asset->url, "/img/libros.jpg"),
      "imagenAlt": coalesce(imagen.alt, titulo),
      "cuerpo": coalesce(cuerpo[]{subtitulo, parrafos}, [])
    }`,
    local.notas,
  );
}

export async function getNota(slug: string): Promise<Nota | undefined> {
  return (await getNotas()).find((n) => n.slug === slug);
}

export async function getDatosDelEstudio(): Promise<typeof local.datosDelEstudio> {
  const remoto = await fetchOr<Partial<typeof local.datosDelEstudio> | null>(
    `*[_type == "datosDelEstudio"][0]{nombre, horarios, direccion, telefono, telefonoWhatsapp, email}`,
    null,
  );
  // Los campos vacíos del panel no pisan los valores de respaldo.
  const definidos = Object.fromEntries(
    Object.entries(remoto ?? {}).filter(([, v]) => v != null && v !== ""),
  );
  return { ...local.datosDelEstudio, ...definidos };
}
