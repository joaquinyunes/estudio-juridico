import type { Metadata } from "next";
import { datosDelEstudio } from "@/lib/content";

export const metadata: Metadata = {
  title: "Aviso legal",
};

export default function AvisoLegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-3xl font-semibold text-navy">
        Aviso legal
      </h1>
      <p className="mt-4 text-slate-600">
        La información publicada en este sitio por {datosDelEstudio.nombre}{" "}
        tiene carácter informativo general y no constituye asesoramiento legal
        para un caso particular. El envío de un formulario o mensaje no genera
        por sí mismo una relación abogado-cliente.
      </p>
      <p className="mt-4 text-slate-600">
        Texto placeholder — debe ser revisado y ajustado por el estudio antes
        del lanzamiento (ver PROGRESS.md, checklist de QA §8.7 del manual).
      </p>
    </div>
  );
}
