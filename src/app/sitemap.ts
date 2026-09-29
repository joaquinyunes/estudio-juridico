import type { MetadataRoute } from "next";
import { getAreas, getNotas } from "@/lib/cms";
import { SITE_URL } from "@/lib/schema-org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [areas, notas] = await Promise.all([getAreas(), getNotas()]);

  const estaticas: [string, number][] = [
    ["", 1],
    ["/calculadora-indemnizacion", 0.9],
    ["/contacto", 0.9],
    ["/equipo", 0.7],
    ["/testimonios", 0.7],
    ["/preguntas-frecuentes", 0.7],
    ["/notas", 0.6],
    ["/legales/aviso-legal", 0.2],
    ["/legales/privacidad", 0.2],
  ];

  return [
    ...estaticas.map(([path, priority]) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      priority,
    })),
    ...areas.map((area) => ({
      url: `${SITE_URL}/areas/${area.slug}`,
      lastModified: new Date(),
      priority: 0.9,
    })),
    ...notas.map((nota) => ({
      url: `${SITE_URL}/notas/${nota.slug}`,
      lastModified: new Date(nota.fecha),
      priority: 0.5,
    })),
  ];
}
