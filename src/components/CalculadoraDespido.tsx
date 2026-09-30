"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { calcularIndemnizacion } from "@/lib/indemnizacion";
import { trackEvent } from "@/lib/analytics";

const pesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function parseFecha(valor: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Calculadora orientativa de liquidación por despido sin causa. */
export function CalculadoraDespido({ oscura = true }: { oscura?: boolean }) {
  const id = useId();
  const [sueldoTexto, setSueldoTexto] = useState("");
  const [ingreso, setIngreso] = useState("");
  const [egreso, setEgreso] = useState("");
  const [preavisado, setPreavisado] = useState(false);
  const [registrado, setRegistrado] = useState(false);

  const sueldo = Number(sueldoTexto.replace(/\D/g, ""));

  const { resultado, error } = useMemo(() => {
    const fIngreso = parseFecha(ingreso);
    const fEgreso = parseFecha(egreso || hoyISO());
    if (!sueldo || !fIngreso || !fEgreso) return { resultado: null, error: null };
    if (fEgreso < fIngreso) {
      return { resultado: null, error: "La fecha de despido no puede ser anterior al ingreso." };
    }
    return {
      resultado: calcularIndemnizacion({ sueldo, ingreso: fIngreso, egreso: fEgreso, preavisado }),
      error: null,
    };
  }, [sueldo, ingreso, egreso, preavisado]);

  const registrarUso = () => {
    if (resultado && !registrado) {
      trackEvent("calculadora_uso", { total: Math.round(resultado.total) });
      setRegistrado(true);
    }
  };

  const texto = oscura ? "text-papel" : "text-tinta";
  const tenue = oscura ? "text-papel/60" : "text-tinta-3";
  const linea = oscura ? "border-papel/20" : "border-linea";

  return (
    <div className={`grid gap-10 lg:grid-cols-12 lg:gap-16 ${texto}`}>
      <form
        className="lg:col-span-5"
        onSubmit={(e) => e.preventDefault()}
        onBlur={registrarUso}
        aria-describedby={`${id}-aviso`}
      >
        <fieldset className="space-y-8">
          <legend className="sr-only">Datos del despido</legend>

          <div>
            <label htmlFor={`${id}-sueldo`} className={`rotulo ${tenue}`}>
              Mejor sueldo bruto mensual
            </label>
            <div className={`mt-2 flex items-baseline border-b ${linea} focus-within:border-lacre-claro`}>
              <span className="font-display text-3xl opacity-50">$</span>
              <input
                id={`${id}-sueldo`}
                inputMode="numeric"
                enterKeyHint="done"
                autoComplete="off"
                placeholder="1.800.000"
                value={sueldo ? sueldo.toLocaleString("es-AR") : ""}
                onChange={(e) => setSueldoTexto(e.target.value)}
                className="w-full bg-transparent py-2 pl-2 font-display text-4xl tracking-tight outline-none placeholder:opacity-30"
              />
            </div>
            <p className={`mt-2 text-sm ${tenue}`}>
              Normal y habitual, sin aguinaldo, vacaciones ni premios que no cobrás todos los meses.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor={`${id}-ingreso`} className={`rotulo ${tenue}`}>
                Fecha de ingreso
              </label>
              <input
                id={`${id}-ingreso`}
                type="date"
                value={ingreso}
                max={hoyISO()}
                onChange={(e) => setIngreso(e.target.value)}
                className={`mt-2 w-full border-b ${linea} bg-transparent py-2 text-lg outline-none focus:border-lacre-claro ${oscura ? "[color-scheme:dark]" : ""}`}
              />
            </div>
            <div>
              <label htmlFor={`${id}-egreso`} className={`rotulo ${tenue}`}>
                Fecha de despido
              </label>
              <input
                id={`${id}-egreso`}
                type="date"
                value={egreso}
                onChange={(e) => setEgreso(e.target.value)}
                className={`mt-2 w-full border-b ${linea} bg-transparent py-2 text-lg outline-none focus:border-lacre-claro ${oscura ? "[color-scheme:dark]" : ""}`}
              />
              <p className={`mt-1 text-xs ${tenue}`}>Vacío = hoy</p>
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={preavisado}
              onChange={(e) => setPreavisado(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--color-lacre)]"
            />
            <span>
              Me avisaron el despido con anticipación (preaviso)
              <span className={`block text-sm ${tenue}`}>
                Si te despidieron de un día para el otro, dejalo sin marcar.
              </span>
            </span>
          </label>
        </fieldset>
      </form>

      <div className="lg:col-span-7" aria-live="polite">
        <div className={`relative border ${linea} p-6 md:p-10 ${oscura ? "bg-papel/[0.03]" : "bg-papel-2/60"}`}>
          <div className="flex items-baseline justify-between gap-4">
            <p className={`rotulo ${tenue}`}>Liquidación estimada</p>
            {resultado && <p className={`rotulo ${tenue}`}>Antigüedad: {resultado.antiguedadTexto}</p>}
          </div>

          {error && <p className="mt-8 text-lacre-claro">{error}</p>}

          {!resultado && !error && (
            <p className={`mt-8 font-display text-2xl leading-snug ${tenue}`}>
              Completá tu sueldo y la fecha de ingreso para ver, renglón por renglón, lo que la ley
              dice que te corresponde.
            </p>
          )}

          {resultado && (
            <>
              {resultado.enPeriodoDePrueba && (
                <p className="mt-6 border-l-2 border-lacre-claro pl-4 text-sm">
                  Con menos de 6 meses estás en período de prueba: no corresponde indemnización por
                  antigüedad ni preaviso, pero sí tu liquidación final.
                </p>
              )}
              <dl className="mt-8 space-y-4">
                {resultado.renglones.map((r) => (
                  <div key={r.id}>
                    <div className="flex items-baseline">
                      <dt>{r.concepto}</dt>
                      <span aria-hidden className="puntos" />
                      <dd className="font-mono tabular-nums">{pesos.format(r.monto)}</dd>
                    </div>
                    <p className={`rotulo mt-1 !text-[0.68rem] ${tenue}`}>{r.base}</p>
                  </div>
                ))}
              </dl>
              <div className={`filete-doble mt-8 pt-6 ${oscura ? "text-papel/60" : "text-tinta/40"}`}>
                <div className={`flex flex-wrap items-baseline justify-between gap-2 ${texto}`}>
                  <span className="rotulo">Total estimado</span>
                  <span className="display text-[clamp(2.5rem,6vw,4.25rem)] tabular-nums">
                    {pesos.format(resultado.total)}
                  </span>
                </div>
              </div>
              <Link
                href="/contacto?area=laboral"
                onClick={registrarUso}
                className={`mt-8 inline-flex items-center gap-3 rounded-full px-6 py-3 font-medium transition-colors ${
                  oscura ? "bg-papel text-tinta hover:bg-lacre-claro" : "bg-tinta text-papel hover:bg-lacre"
                }`}
              >
                Que una abogada revise este cálculo <span aria-hidden>→</span>
              </Link>
            </>
          )}
        </div>
        <p id={`${id}-aviso`} className={`mt-4 text-xs leading-relaxed ${tenue}`}>
          Estimación orientativa según la LCT con las reformas de las leyes 27.742 y 27.802. No
          incluye topes de convenio, el piso del fallo “Vizzoti”, la incidencia del aguinaldo sobre
          preaviso e integración ni agravantes (despido discriminatorio, embarazo, matrimonio).
          No constituye asesoramiento legal.
        </p>
      </div>
    </div>
  );
}
