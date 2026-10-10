import "server-only";
import { sanityClient } from "./sanity";
import * as local from "./content";
import type {
  Abogado,
  AreaDePractica,
  Cifra,
  Faq,
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
    `*[_type == "datosDelEstudio"][0]{nombre, horarios, guardia, direccion, referencia, telefono, telefonoWhatsapp, email}`,
    null,
  );
  // Los campos vacíos del panel no pisan los valores de respaldo.
  const definidos = Object.fromEntries(
    Object.entries(remoto ?? {}).filter(([, v]) => v != null && v !== ""),
  );
  return { ...local.datosDelEstudio, ...definidos };
}

/** Cifras de la portada: del panel si hay al menos una; si no, las de respaldo. */
export async function getCifras(): Promise<Cifra[]> {
  const remotas = await fetchOr<Cifra[] | null>(
    `*[_type == "datosDelEstudio"][0].cifras[]{valor, "unidad": coalesce(unidad, ""), texto}`,
    null,
  );
  return remotas && remotas.length > 0 ? remotas : local.cifras;
}

export function getFaqsGenerales(): Promise<Faq[]> {
  return fetchOr(
    `*[_type == "faqGeneral"] | order(orden asc) {pregunta, respuesta}`,
    local.faqsGenerales,
  );
}

export type Aviso = {
  etiqueta: string;
  texto: string;
  enlace?: string;
  enlaceTexto?: string;
};

/** Fecha de hoy en Buenos Aires como AAAA-MM-DD, para comparar con `desde`/`hasta`. */
function hoyEnBuenosAires(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).format(new Date());
}

/**
 * Aviso del sitio. Con el panel conectado, "sin aviso" significa que no hay
 * ninguno vigente (no se cae al aviso de demostración de `content.ts`).
 */
export async function getAviso(): Promise<Aviso | null> {
  if (!sanityClient) return local.avisoDemo;
  try {
    const a = await sanityClient.fetch<
      (Aviso & { activo?: boolean; desde?: string; hasta?: string }) | null
    >(
      `*[_type == "aviso"][0]{activo, etiqueta, texto, enlace, enlaceTexto, desde, hasta}`,
      {},
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    if (!a || a.activo === false || !a.texto) return null;
    const hoy = hoyEnBuenosAires();
    if (a.desde && hoy < a.desde) return null;
    if (a.hasta && hoy > a.hasta) return null;
    return {
      etiqueta: a.etiqueta || "Novedad",
      texto: a.texto,
      enlace: a.enlace || undefined,
      enlaceTexto: a.enlaceTexto || "Ver más",
    };
  } catch (err) {
    console.error("Sanity no respondió; no se muestra aviso", err);
    return null;
  }
}
