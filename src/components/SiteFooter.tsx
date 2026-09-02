import Link from "next/link";
import { datosDelEstudio } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-16">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-500 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <p>
          {datosDelEstudio.nombre} · {datosDelEstudio.direccion} ·{" "}
          {datosDelEstudio.horarios}
        </p>
        <Link href="/legales/aviso-legal" className="hover:text-slate-700">
          Aviso legal
        </Link>
      </div>
    </footer>
  );
}
