import type { MetadataRoute } from "next";
import { datosDelEstudio } from "@/lib/content";

/** Manifest de la app instalable (Agregar a pantalla de inicio en Android e iPhone). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${datosDelEstudio.nombre} — Abogados`,
    short_name: datosDelEstudio.nombre,
    description:
      "Consultá tu caso, calculá tu indemnización y hablá con el estudio desde el celular.",
    lang: "es-AR",
    dir: "ltr",
    start_url: "/?origen=app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f3ede2",
    theme_color: "#f3ede2",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Contanos tu caso",
        short_name: "Consulta",
        url: "/contacto?origen=app",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Calculadora de indemnización",
        short_name: "Calculadora",
        url: "/calculadora-indemnizacion?origen=app",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
