import type { AreaDePractica, Faq } from "./content";
import { datosDelEstudio } from "./content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export function buildLegalServiceJsonLd(area: AreaDePractica) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: `${datosDelEstudio.nombre} — ${area.nombre}`,
    description: area.descripcionCorta,
    url: `${SITE_URL}/areas/${area.slug}`,
    areaServed: "AR",
    address: datosDelEstudio.direccion,
    telephone: `+${datosDelEstudio.telefonoWhatsapp}`,
    openingHours: datosDelEstudio.horarios,
  };
}

export function buildFaqPageJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.respuesta,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
