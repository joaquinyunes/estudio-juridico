import type { MetadataRoute } from "next";
import { areasDePractica } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/equipo",
    "/testimonios",
    "/preguntas-frecuentes",
    "/contacto",
    "/legales/aviso-legal",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const areaRoutes = areasDePractica.map((area) => ({
    url: `${SITE_URL}/areas/${area.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...areaRoutes];
}
