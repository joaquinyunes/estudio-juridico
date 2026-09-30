"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { buildMensajeCalificado, buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export const URGENCIAS = [
  { valor: "inmediata", etiqueta: "Tengo un plazo o audiencia esta semana" },
  { valor: "mes", etiqueta: "Necesito resolverlo este mes" },
  { valor: "informacion", etiqueta: "Por ahora quiero informarme" },
] as const;

const MIN_RESUMEN = 20;

// Validación en el cliente con las reglas nativas de react-hook-form (sin Zod,
// para no enviar ~100 KB de JS al navegador). /api/lead vuelve a validar con Zod.
type FormValues = {
  nombre: string;
  area: string;
  urgencia: (typeof URGENCIAS)[number]["valor"];
  resumen: string;
  acepta: boolean;
  empresa?: string; // honeypot: los humanos no lo ven
};

const reglas = {
  nombre: {
    validate: (v: string) => v.trim().length >= 2 || "Ingresá tu nombre",
  },
  area: { required: "Elegí el área de tu consulta" },
  urgencia: { required: "Indicá qué tan urgente es" },
  resumen: {
    validate: (v: string) => {
      const largo = v.trim().length;
      if (largo < MIN_RESUMEN) return `Contanos un poco más (mínimo ${MIN_RESUMEN} caracteres)`;
      if (largo > 1500) return "Resumilo en menos de 1500 caracteres";
      return true;
    },
  },
  acepta: { required: "Necesitamos tu consentimiento para responderte" },
} as const;

type Props = {
  areas: { slug: string; nombre: string }[];
  areaPreseleccionada?: string;
  tono?: "claro" | "oscuro";
};

export function FormularioCalificador({ areas, areaPreseleccionada, tono = "claro" }: Props) {
  const [whatsappHref, setWhatsappHref] = useState<string | null>(null);
  const [nombreEnviado, setNombreEnviado] = useState("");
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      area: areas.some((a) => a.slug === areaPreseleccionada) ? areaPreseleccionada : "",
      resumen: "",
    },
  });

  const largoResumen = useWatch({ control, name: "resumen" })?.trim().length ?? 0;
  const areaElegida = useWatch({ control, name: "area" });
  const oscuro = tono === "oscuro";
  const tenue = oscuro ? "text-papel/60" : "text-tinta-3";

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const areaNombre = areas.find((a) => a.slug === values.area)?.nombre ?? values.area;
    const urgencia = URGENCIAS.find((u) => u.valor === values.urgencia)?.etiqueta;

    try {
      // El registro del lead nunca bloquea el paso a WhatsApp.
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, areaNombre }),
      }).catch(() => undefined);

      setWhatsappHref(
        buildWhatsAppLink(
          buildMensajeCalificado({ area: areaNombre, resumen: values.resumen, nombre: values.nombre, urgencia }),
        ),
      );
      setNombreEnviado(values.nombre.split(" ")[0]);
      trackEvent("form_submit_por_area", { area: values.area, urgencia: values.urgencia });
    } catch {
      setError("No pudimos procesar el formulario. Intentá de nuevo.");
    }
  };

  if (whatsappHref) {
    return (
      <div role="status" className={`border-l-2 border-lacre py-2 pl-6 ${oscuro ? "text-papel" : ""}`}>
        <p className="rotulo text-lacre">Consulta registrada</p>
        <p className="mt-4 font-display text-3xl leading-tight md:text-4xl">
          Gracias, {nombreEnviado}. Último paso: <em className="enfasis">enviala por WhatsApp.</em>
        </p>
        <p className={`mt-4 max-w-md leading-relaxed ${tenue}`}>
          Se abre WhatsApp con el resumen de tu caso ya escrito. Solo tenés que tocar enviar: así la
          abogada que lo lea ya sabe de qué se trata.
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { origen: "formulario" })}
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#1f6f4a] px-7 py-4 font-medium text-white transition-colors hover:bg-[#185a3c]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z" />
          </svg>
          Enviar por WhatsApp
        </a>
      </div>
    );
  }

  const campoBase = `campo ${oscuro ? "text-papel border-papel/25" : ""}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={`space-y-9 ${oscuro ? "text-papel" : ""}`}>
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor="empresa">No completar</label>
        <input id="empresa" tabIndex={-1} autoComplete="off" {...register("empresa")} />
      </div>

      <fieldset>
        <legend className={`rotulo ${tenue}`}>1 · ¿Sobre qué es tu consulta?</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {areas.map((area) => {
            const elegida = areaElegida === area.slug;
            return (
              <label
                key={area.slug}
                className={`flex min-h-11 cursor-pointer items-center rounded-full border px-4 py-2 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lacre ${
                  elegida
                    ? "border-lacre bg-lacre text-papel"
                    : oscuro
                      ? "border-papel/30 hover:border-papel"
                      : "border-linea hover:border-tinta"
                }`}
              >
                <input type="radio" value={area.slug} className="sr-only" {...register("area", reglas.area)} />
                {area.nombre}
              </label>
            );
          })}
        </div>
        {errors.area && <p className="mt-2 text-sm text-lacre">{errors.area.message}</p>}
      </fieldset>

      <fieldset>
        <legend className={`rotulo ${tenue}`}>2 · ¿Qué tan urgente es?</legend>
        <div className="mt-3 space-y-1">
          {URGENCIAS.map((u) => (
            <label key={u.valor} className="flex min-h-11 cursor-pointer items-center gap-3 py-2">
              <input
                type="radio"
                value={u.valor}
                className="h-4 w-4 accent-[var(--color-lacre)]"
                {...register("urgencia", reglas.urgencia)}
              />
              <span>{u.etiqueta}</span>
            </label>
          ))}
        </div>
        {errors.urgencia && <p className="mt-2 text-sm text-lacre">{errors.urgencia.message}</p>}
      </fieldset>

      <div>
        <label htmlFor="nombre" className={`rotulo ${tenue}`}>
          3 · Tu nombre
        </label>
        <input
          id="nombre"
          autoComplete="name"
          autoCapitalize="words"
          enterKeyHint="next"
          placeholder="Nombre y apellido"
          aria-invalid={!!errors.nombre}
          className={campoBase}
          {...register("nombre", reglas.nombre)}
        />
        {errors.nombre && <p className="mt-2 text-sm text-lacre">{errors.nombre.message}</p>}
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="resumen" className={`rotulo ${tenue}`}>
            4 · Contanos qué pasó
          </label>
          <span
            className={`rotulo !text-[0.68rem] tabular-nums ${largoResumen >= MIN_RESUMEN ? "text-[#1f6f4a]" : tenue}`}
          >
            {largoResumen >= MIN_RESUMEN ? "✓ Suficiente" : `${largoResumen}/${MIN_RESUMEN}`}
          </span>
        </div>
        <textarea
          id="resumen"
          rows={4}
          placeholder="Ej.: Trabajé 6 años en una empresa de logística y ayer me despidieron sin causa por telegrama…"
          aria-invalid={!!errors.resumen}
          className={`${campoBase} resize-y`}
          {...register("resumen", reglas.resumen)}
        />
        {errors.resumen && <p className="mt-2 text-sm text-lacre">{errors.resumen.message}</p>}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--color-lacre)]" {...register("acepta", reglas.acepta)} />
          <span className={tenue}>
            Acepto que el estudio use estos datos solo para responder mi consulta, según la{" "}
            <Link href="/legales/privacidad" className="underline underline-offset-2">
              política de privacidad
            </Link>{" "}
            (Ley 25.326).
          </span>
        </label>
        {errors.acepta && <p className="mt-2 text-sm text-lacre">{errors.acepta.message}</p>}
      </div>

      {error && <p className="text-sm text-lacre">{error}</p>}

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center gap-3 rounded-full px-7 py-4 font-medium transition-colors disabled:opacity-50 ${
            oscuro ? "bg-papel text-tinta hover:bg-lacre-claro" : "bg-tinta text-papel hover:bg-lacre"
          }`}
        >
          {isSubmitting ? "Registrando…" : "Continuar"}
          <span aria-hidden>→</span>
        </button>
        <p className={`text-sm ${tenue}`}>Respuesta en 48 h hábiles · Sin costo</p>
      </div>
    </form>
  );
}
