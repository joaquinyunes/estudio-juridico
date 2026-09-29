"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Monograma } from "./Sello";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const NAV = [
  { href: "/#estudio", label: "Estudio" },
  { href: "/#areas", label: "Áreas" },
  { href: "/equipo", label: "Equipo" },
  { href: "/testimonios", label: "Casos" },
  { href: "/notas", label: "Notas" },
  { href: "/calculadora-indemnizacion", label: "Calculadora" },
];

type Props = {
  nombre: string;
  direccion: string;
  horarios: string;
  telefonoWhatsapp: string;
};

export function SiteHeader({ nombre, direccion, horarios, telefonoWhatsapp }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [compacto, setCompacto] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setCompacto(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto]);

  const guardiaHref = buildWhatsAppLink(
    "URGENTE — Necesito asistencia penal ahora.",
    telefonoWhatsapp,
  );

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-tinta focus:px-4 focus:py-2 focus:text-papel"
      >
        Saltar al contenido
      </a>

      <div className="hidden bg-tinta text-papel/80 md:block">
        <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-6 px-6 py-2 rotulo !text-[0.68rem]">
          <span>
            {direccion} · Frente a Tribunales
          </span>
          <span className="flex items-center gap-6">
            <span>{horarios}</span>
            <a
              href={guardiaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-lacre-claro hover:text-papel"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lacre-claro opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lacre-claro" />
              </span>
              Guardia penal 24 h
            </a>
          </span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
          compacto || abierto
            ? "border-linea bg-papel/90 backdrop-blur-md"
            : "border-transparent bg-papel"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[88rem] items-center justify-between gap-6 px-6 transition-[padding] duration-500 ${
            compacto ? "py-3" : "py-5"
          }`}
        >
          <Link href="/" className="group flex items-center gap-3">
            <Monograma className="h-10 w-10 transition-transform duration-700 group-hover:rotate-[20deg]" />
            <span className="leading-none">
              <span className="block font-display text-[1.35rem] tracking-tight">{nombre}</span>
              <span className="rotulo mt-1 block !text-[0.68rem] text-tinta-3">
                Abogados · Desde 1987
              </span>
            </span>
          </Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-7 text-[0.92rem]">
              {NAV.map((item) => {
                const activo = !item.href.startsWith("/#") && pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={activo ? "page" : undefined}
                      className={`enlace pb-0.5 ${activo ? "text-lacre" : "text-tinta-2 hover:text-tinta"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contacto"
              className="hidden items-center gap-2 rounded-full bg-tinta px-5 py-2.5 text-sm text-papel transition-colors hover:bg-lacre sm:inline-flex"
            >
              Contanos tu caso
              <span aria-hidden>→</span>
            </Link>
            <button
              type="button"
              onClick={() => setAbierto((v) => !v)}
              aria-expanded={abierto}
              aria-controls="menu-movil"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-linea lg:hidden"
            >
              <span className="sr-only">{abierto ? "Cerrar menú" : "Abrir menú"}</span>
              <span
                aria-hidden
                className={`absolute h-px w-5 bg-tinta transition-transform duration-300 ${abierto ? "rotate-45" : "-translate-y-1"}`}
              />
              <span
                aria-hidden
                className={`absolute h-px w-5 bg-tinta transition-transform duration-300 ${abierto ? "-rotate-45" : "translate-y-1"}`}
              />
            </button>
          </div>
        </div>

        <div
          id="menu-movil"
          hidden={!abierto}
          className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-linea bg-papel px-6 pb-10 lg:hidden"
        >
          <nav aria-label="Menú móvil">
            <ol className="divide-y divide-linea">
              {[...NAV, { href: "/contacto", label: "Contacto" }].map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setAbierto(false)}
                    className="flex items-baseline gap-4 py-5"
                  >
                    <span className="rotulo text-lacre">§ {String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-3xl">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <div className="mt-8 space-y-2 text-sm text-tinta-2">
            <p>{direccion}, CABA</p>
            <p>{horarios}</p>
            <a
              href={guardiaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block pt-2 font-medium text-lacre"
            >
              Guardia penal 24 h →
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
