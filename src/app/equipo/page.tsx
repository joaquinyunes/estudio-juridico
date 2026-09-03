import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equipo",
  description: "Conocé al equipo del estudio y sus credenciales.",
};

export default function EquipoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-3xl font-semibold text-navy">Equipo</h1>
      <p className="mt-4 text-slate-600">
        Contenido pendiente de carga real (matrículas, especializaciones y
        trayectoria de cada abogado/a). Ver PROGRESS.md — se completa con datos
        reales una vez definido el cliente.
      </p>
    </div>
  );
}
