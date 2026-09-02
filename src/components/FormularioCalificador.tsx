"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { areasDePractica } from "@/lib/content";
import { buildMensajeCalificado, buildWhatsAppLink } from "@/lib/whatsapp";

const schema = z.object({
  nombre: z.string().min(2, "Ingresá tu nombre"),
  area: z.string().min(1, "Elegí un área"),
  resumen: z
    .string()
    .min(20, "Contanos un poco más de tu caso (mínimo 20 caracteres)"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  areaPreseleccionada?: string;
};

export function FormularioCalificador({ areaPreseleccionada }: Props) {
  const [enviado, setEnviado] = useState(false);
  const [whatsappHref, setWhatsappHref] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { area: areaPreseleccionada ?? "" },
  });

  const onSubmit = async (values: FormValues) => {
    setEnviando(true);
    setError(null);
    try {
      const areaNombre =
        areasDePractica.find((a) => a.slug === values.area)?.nombre ?? values.area;

      const mensaje = buildMensajeCalificado({
        area: areaNombre,
        resumen: values.resumen,
        nombre: values.nombre,
      });

      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, areaNombre }),
      }).catch(() => {
        // El envío del lead por email no debe bloquear el flujo a WhatsApp.
      });

      setWhatsappHref(buildWhatsAppLink(mensaje));
      setEnviado(true);

      if (typeof window !== "undefined" && "gtag" in window) {
        // @ts-expect-error gtag inyectado por el script de GA4
        window.gtag("event", "form_submit_por_area", { area: values.area });
      }
    } catch {
      setError("No pudimos procesar el formulario. Intentá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  if (enviado && whatsappHref) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
        <p className="text-emerald-900 font-medium mb-4">
          Listo. Continuá la consulta por WhatsApp con el resumen de tu caso ya
          cargado.
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-6 py-3 text-white font-medium hover:bg-emerald-800 transition-colors"
        >
          Continuar por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium mb-1">
          Nombre
        </label>
        <input
          id="nombre"
          {...register("nombre")}
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
        {errors.nombre && (
          <p className="text-sm text-red-600 mt-1">{errors.nombre.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="area" className="block text-sm font-medium mb-1">
          Área de tu consulta
        </label>
        <select
          id="area"
          {...register("area")}
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <option value="">Elegí un área</option>
          {areasDePractica.map((area) => (
            <option key={area.slug} value={area.slug}>
              {area.nombre}
            </option>
          ))}
        </select>
        {errors.area && (
          <p className="text-sm text-red-600 mt-1">{errors.area.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="resumen" className="block text-sm font-medium mb-1">
          Resumen breve de tu caso
        </label>
        <textarea
          id="resumen"
          rows={4}
          {...register("resumen")}
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
        {errors.resumen && (
          <p className="text-sm text-red-600 mt-1">{errors.resumen.message}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-white font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
      >
        {enviando ? "Enviando..." : "Continuar"}
      </button>
    </form>
  );
}
