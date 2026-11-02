import type { Metadata } from "next";
import { getNotas } from "@/lib/cms";
import { CabeceraPagina } from "@/components/CabeceraPagina";
import { TarjetaNota } from "@/components/TarjetaNota";

export const metadata: Metadata = {
  title: "Notas",
  description:
    "Notas del estudio para entender tus derechos: reforma laboral, divorcio, sucesiones y más, explicado sin tecnicismos.",
  alternates: { canonical: "/notas" },
};

export default async function NotasPage() {
  const notas = await getNotas();
  const [destacada, ...resto] = notas;

  return (
    <>
      <CabeceraPagina
        rotulo="Notas"
        titulo={
          <>
            El derecho, <em>en castellano.</em>
          </>
        }
        bajada="Notas breves escritas por el equipo del estudio sobre los cambios legales que más consultas generan."
      />
      <div className="mx-auto max-w-[88rem] px-6 pb-24">
        <h2 className="sr-only">Todas las notas</h2>
        {destacada && (
          <div className="max-w-4xl">
            <TarjetaNota nota={destacada} variante="destacada" />
          </div>
        )}
        <div className="mt-20 grid gap-14 border-t border-tinta pt-14 md:grid-cols-2 lg:grid-cols-3">
          {resto.map((nota) => (
            <TarjetaNota key={nota.slug} nota={nota} />
          ))}
        </div>
      </div>
    </>
  );
}
