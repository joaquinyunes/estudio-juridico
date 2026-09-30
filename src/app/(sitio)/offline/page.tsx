import type { Metadata } from "next";
import Link from "next/link";
import { datosDelEstudio } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sin conexión",
  robots: { index: false },
};

/** Se muestra cuando el celular no tiene conexión y la página pedida no está guardada. */
export default function OfflinePage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[88rem] flex-col justify-center px-6 py-20">
      <p className="rotulo text-lacre">Sin conexión</p>
      <h1 className="display mt-6 max-w-3xl text-[clamp(2.8rem,8vw,6.5rem)]">
        No hay señal, <em>pero seguimos acá.</em>
      </h1>
      <p className="mt-8 max-w-xl text-lg leading-relaxed text-tinta-2">
        Tu celular está sin internet. Podés llamarnos igual, o usar la calculadora de indemnización,
        que funciona sin conexión.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href={`tel:${datosDelEstudio.telefono.replace(/[^\d+]/g, "")}`}
          className="inline-flex items-center gap-3 rounded-full bg-tinta px-7 py-4 text-papel"
        >
          Llamar al {datosDelEstudio.telefono}
        </a>
        <Link
          href="/calculadora-indemnizacion"
          className="inline-flex items-center rounded-full border border-tinta px-7 py-4"
        >
          Abrir la calculadora
        </Link>
      </div>
    </section>
  );
}
