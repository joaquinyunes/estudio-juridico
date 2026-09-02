import Link from "next/link";
import { datosDelEstudio } from "@/lib/content";

const NAV = [
  { href: "/equipo", label: "Equipo" },
  { href: "/testimonios", label: "Casos resueltos" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg font-semibold text-slate-900">
          {datosDelEstudio.nombre}
        </Link>
        <nav className="hidden md:flex gap-6 text-sm text-slate-600">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-slate-900">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
