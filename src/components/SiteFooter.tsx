import Link from "next/link";
import type { AreaDePractica, datosDelEstudio as DatosTipo } from "@/lib/content";
import { Sello } from "./Sello";

type Props = {
  datos: typeof DatosTipo;
  areas: Pick<AreaDePractica, "slug" | "nombre">[];
};

export function SiteFooter({ datos, areas }: Props) {
  const anio = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-noche text-papel">
      <div className="mx-auto max-w-[88rem] px-6 pt-20 pb-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="rotulo text-lacre-claro">§ Final — Contacto</p>
            <p className="mt-6 max-w-md font-display text-3xl leading-tight md:text-4xl">
              Una consulta a tiempo evita un juicio. <em className="enfasis">Escribinos hoy.</em>
            </p>
            <Link
              href="/contacto"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-papel px-6 py-3 text-tinta transition-colors hover:bg-lacre-claro"
            >
              Contanos tu caso <span aria-hidden>→</span>
            </Link>
          </div>

          <nav aria-label="Áreas de práctica" className="md:col-span-2">
            <p className="rotulo text-papel/60">Áreas</p>
            <ul className="mt-5 space-y-2.5 text-papel/80">
              {areas.map((a) => (
                <li key={a.slug}>
                  <Link href={`/areas/${a.slug}`} className="enlace hover:text-papel">
                    {a.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Estudio" className="md:col-span-2">
            <p className="rotulo text-papel/60">Estudio</p>
            <ul className="mt-5 space-y-2.5 text-papel/80">
              {[
                ["/equipo", "Equipo"],
                ["/testimonios", "Casos resueltos"],
                ["/notas", "Notas"],
                ["/calculadora-indemnizacion", "Calculadora"],
                ["/preguntas-frecuentes", "Preguntas frecuentes"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="enlace hover:text-papel">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <address className="not-italic md:col-span-3">
            <p className="rotulo text-papel/60">Oficina</p>
            <div className="mt-5 space-y-2.5 text-papel/80">
              <p>
                {datos.direccion}
                <br />
                {datos.localidad} · {datos.codigoPostal}
              </p>
              <p>{datos.horarios}</p>
              <p>
                <a href={`tel:${datos.telefono.replace(/[^\d+]/g, "")}`} className="enlace hover:text-papel">
                  {datos.telefono}
                </a>
              </p>
              <p>
                <a href={`mailto:${datos.email}`} className="enlace break-all hover:text-papel">
                  {datos.email}
                </a>
              </p>
            </div>
          </address>
        </div>

        <div className="relative mt-20">
          {/* Marca de agua decorativa en SVG: escala exacta al ancho disponible. */}
          <svg aria-hidden viewBox="0 0 1000 150" className="block w-full select-none md:w-[85%]">
            <text
              x="0"
              y="128"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              fill="var(--color-papel)"
              fillOpacity="0.07"
              fontFamily="var(--font-fraunces), Georgia, serif"
              fontSize="160"
              letterSpacing="-6"
            >
              Iturbe &amp; Lavalle
            </text>
          </svg>
          <Sello className="absolute right-0 bottom-0 h-20 w-20 md:h-36 md:w-36" />
        </div>

        <div className="filete-doble mt-8 pt-6 text-papel/20">
          <div className="flex flex-col gap-4 text-xs leading-relaxed text-papel/60 md:flex-row md:items-start md:justify-between">
            <p className="max-w-2xl">
              © {anio} {datos.nombreLegal}. Abogados matriculados en el Colegio Público de la
              Abogacía de la Capital Federal. La información de este sitio es general y no
              constituye asesoramiento legal para un caso concreto; el envío de una consulta no
              genera por sí mismo una relación abogado-cliente.
              {datos.modoDemo && (
                <span className="mt-2 block text-lacre-claro">
                  Sitio de demostración: estudio, profesionales, matrículas y casos son ficticios.
                </span>
              )}
            </p>
            <ul className="flex shrink-0 gap-5">
              <li>
                <Link href="/legales/aviso-legal" className="enlace hover:text-papel">
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link href="/legales/privacidad" className="enlace hover:text-papel">
                  Privacidad
                </Link>
              </li>
              <li>
                <a href={datos.redes.linkedin} className="enlace hover:text-papel" rel="noopener noreferrer" target="_blank">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
