import type { MiembroDelEquipo } from "@/lib/content";

function iniciales(nombre: string): string {
  return nombre
    .replace(/^(Dra?\.|Dr\.)\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join("")
    .toUpperCase();
}

export function MiembroEquipoCard({ miembro }: { miembro: MiembroDelEquipo }) {
  return (
    <div className="rounded-lg border border-slate-200 p-6">
      <div className="flex items-center gap-4">
        <div
          aria-hidden
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy text-gold font-serif text-lg font-semibold"
        >
          {iniciales(miembro.nombre)}
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold text-navy">
            {miembro.nombre}
          </h3>
          <p className="text-sm text-slate-500">{miembro.cargo}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600">{miembro.bio}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {miembro.especialidades.map((especialidad) => (
          <span
            key={especialidad}
            className="text-xs rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-navy"
          >
            {especialidad}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-400">{miembro.matricula}</p>
    </div>
  );
}
