import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BarraMovil } from "@/components/BarraMovil";
import { JsonLd } from "@/components/JsonLd";
import { getAreas, getDatosDelEstudio } from "@/lib/cms";
import { buildOrganizationJsonLd } from "@/lib/schema-org";

export default async function SitioLayout({ children }: LayoutProps<"/">) {
  const [datos, areas] = await Promise.all([getDatosDelEstudio(), getAreas()]);

  return (
    <>
      <JsonLd data={buildOrganizationJsonLd(datos, areas)} />
      <SiteHeader
        nombre={datos.nombre}
        direccion={datos.direccion}
        horarios={datos.horarios}
        telefonoWhatsapp={datos.telefonoWhatsapp}
      />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <SiteFooter datos={datos} areas={areas} />
      <div aria-hidden className="h-[calc(4.5rem+env(safe-area-inset-bottom))] bg-noche sm:hidden" />
      <BarraMovil telefono={datos.telefono} />
    </>
  );
}
