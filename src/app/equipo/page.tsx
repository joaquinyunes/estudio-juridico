import type { Metadata } from "next";
import { equipo } from "@/lib/content";
import { MiembroEquipoCard } from "@/components/MiembroEquipoCard";

export const metadata: Metadata = {
  title: "Equipo",
  description: "Conocé al equipo del estudio y sus credenciales.",
};

export default function EquipoPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="font-serif text-3xl font-semibold text-navy">Equipo</h1>
      <p className="mt-4 text-slate-600 max-w-2xl">
        Nombres, matrículas y trayectorias de ejemplo — se reemplazan por los
        datos reales del estudio antes de publicar el sitio (ver PROGRESS.md).
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {equipo.map((miembro) => (
          <MiembroEquipoCard key={miembro.nombre} miembro={miembro} />
        ))}
      </div>
    </div>
  );
}
