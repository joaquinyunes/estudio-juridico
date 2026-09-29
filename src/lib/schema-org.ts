import type { Abogado, AreaDePractica, Faq, Nota } from "./content";
import type { datosDelEstudio } from "./content";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://iturbelavalle.example"
).replace(/\/$/, "");

type Datos = typeof datosDelEstudio;

/** Las imágenes locales son rutas relativas; las de Sanity ya vienen absolutas. */
const abs = (url: string) => (url.startsWith("http") ? url : `${SITE_URL}${url}`);

function postalAddress(datos: Datos) {
  return {
    "@type": "PostalAddress",
    streetAddress: datos.direccion,
    addressLocality: datos.localidad,
    postalCode: datos.codigoPostal,
    addressRegion: "CABA",
    addressCountry: "AR",
  };
}

const horarios = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  opens: "09:00",
  closes: "18:00",
};

export function buildOrganizationJsonLd(datos: Datos, areas: AreaDePractica[]) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${SITE_URL}/#estudio`,
    name: datos.nombreLegal,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/opengraph-image`,
    foundingDate: String(datos.fundacion),
    telephone: datos.telefono,
    email: datos.email,
    address: postalAddress(datos),
    geo: { "@type": "GeoCoordinates", latitude: datos.geo.lat, longitude: datos.geo.lng },
    openingHoursSpecification: horarios,
    areaServed: [
      { "@type": "City", name: "Ciudad Autónoma de Buenos Aires" },
      { "@type": "State", name: "Provincia de Buenos Aires" },
    ],
    priceRange: "Consulta inicial sin costo",
    knowsAbout: areas.map((a) => a.nombre),
    sameAs: Object.values(datos.redes),
  };
}

export function buildLegalServiceJsonLd(area: AreaDePractica, datos: Datos) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: `${datos.nombre} — ${area.nombre}`,
    description: area.descripcionCorta,
    url: `${SITE_URL}/areas/${area.slug}`,
    image: abs(area.imagen),
    telephone: datos.telefono,
    address: postalAddress(datos),
    openingHoursSpecification: horarios,
    areaServed: "AR",
    parentOrganization: { "@id": `${SITE_URL}/#estudio` },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: area.nombre,
      itemListElement: area.bullets.map((b) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: b },
      })),
    },
  };
}

export function buildFaqPageJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.pregunta,
      acceptedAnswer: { "@type": "Answer", text: faq.respuesta },
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
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function buildEquipoJsonLd(equipo: Abogado[]) {
  return {
    "@context": "https://schema.org",
    "@graph": equipo.map((a) => ({
      "@type": "Person",
      name: a.nombre,
      jobTitle: a.cargo,
      image: abs(a.foto),
      worksFor: { "@id": `${SITE_URL}/#estudio` },
      description: a.bio,
    })),
  };
}

export function buildArticleJsonLd(nota: Nota) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: nota.titulo,
    description: nota.bajada,
    datePublished: nota.fecha,
    image: abs(nota.imagen),
    author: { "@type": "Person", name: nota.autor },
    publisher: { "@id": `${SITE_URL}/#estudio` },
    mainEntityOfPage: `${SITE_URL}/notas/${nota.slug}`,
    inLanguage: "es-AR",
  };
}
