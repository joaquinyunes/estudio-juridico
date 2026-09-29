/**
 * Estimación orientativa de la liquidación por despido sin causa
 * (Ley de Contrato de Trabajo, con las reformas de las leyes 27.742 y 27.802).
 *
 * Simplificaciones deliberadas, que la UI informa al usuario:
 * - No aplica topes de convenio colectivo (art. 245, 2° párr.) ni el piso
 *   del 67 % (fallo "Vizzoti").
 * - No incluye la incidencia del SAC sobre preaviso, integración ni vacaciones.
 * - No contempla agravantes (art. 245 bis, embarazo, matrimonio, etc.).
 */

export type EntradaIndemnizacion = {
  /** Mejor remuneración mensual, normal y habitual, bruta (sin SAC, vacaciones ni premios no mensuales). */
  sueldo: number;
  ingreso: Date;
  egreso: Date;
  /** true si el empleador otorgó preaviso en tiempo y forma. */
  preavisado: boolean;
};

export type RenglonLiquidacion = {
  id: string;
  concepto: string;
  base: string;
  monto: number;
};

export type ResultadoIndemnizacion = {
  renglones: RenglonLiquidacion[];
  total: number;
  antiguedadTexto: string;
  enPeriodoDePrueba: boolean;
};

const MESES_PERIODO_DE_PRUEBA = 6;

function sumarMeses(fecha: Date, meses: number): Date {
  const d = new Date(fecha);
  const dia = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + meses);
  const ultimo = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(dia, ultimo));
  return d;
}

function diasEntre(desde: Date, hasta: Date): number {
  const utc = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((utc(hasta) - utc(desde)) / 86_400_000);
}

/** Meses completos entre dos fechas. */
function mesesCompletos(desde: Date, hasta: Date): number {
  let meses =
    (hasta.getFullYear() - desde.getFullYear()) * 12 + (hasta.getMonth() - desde.getMonth());
  if (sumarMeses(desde, meses) > hasta) meses -= 1;
  return Math.max(0, meses);
}

function diasDeVacaciones(anios: number): number {
  if (anios > 20) return 35;
  if (anios > 10) return 28;
  if (anios > 5) return 21;
  return 14;
}

export function calcularIndemnizacion({
  sueldo,
  ingreso,
  egreso,
  preavisado,
}: EntradaIndemnizacion): ResultadoIndemnizacion {
  const meses = mesesCompletos(ingreso, egreso);
  const anios = Math.floor(meses / 12);
  const mesesRestantes = meses % 12;
  const enPeriodoDePrueba = meses < MESES_PERIODO_DE_PRUEBA;

  // Art. 245: un mes por año de servicio o fracción mayor de tres meses.
  // "Mayor de tres meses" exige superar los 3 meses, no igualarlos.
  const superaFraccion = sumarMeses(ingreso, anios * 12 + 3) < egreso;
  const aniosComputables = anios + (superaFraccion ? 1 : 0);

  const renglones: RenglonLiquidacion[] = [];

  if (!enPeriodoDePrueba) {
    const periodos = Math.max(1, aniosComputables);
    renglones.push({
      id: "antiguedad",
      concepto: "Indemnización por antigüedad",
      base: `Art. 245 LCT · ${periodos} ${periodos === 1 ? "sueldo" : "sueldos"}`,
      monto: sueldo * periodos,
    });
  }

  const diasDelMes = new Date(egreso.getFullYear(), egreso.getMonth() + 1, 0).getDate();
  const diaEgreso = egreso.getDate();

  if (!preavisado && !enPeriodoDePrueba) {
    // Dos meses si la antigüedad es "superior a cinco años".
    const mesesPreaviso = egreso > sumarMeses(ingreso, 60) ? 2 : 1;
    renglones.push({
      id: "preaviso",
      concepto: "Indemnización sustitutiva de preaviso",
      base: `Arts. 231/232 LCT · ${mesesPreaviso} ${mesesPreaviso === 1 ? "mes" : "meses"}`,
      monto: sueldo * mesesPreaviso,
    });

    const diasIntegracion = diasDelMes - diaEgreso;
    if (diasIntegracion > 0) {
      renglones.push({
        id: "integracion",
        concepto: "Integración del mes de despido",
        base: `Art. 233 LCT · ${diasIntegracion} días`,
        monto: (sueldo / diasDelMes) * diasIntegracion,
      });
    }
  }

  // Liquidación final: se debe siempre, cualquiera sea la causa.
  renglones.push({
    id: "dias",
    concepto: "Días trabajados del mes",
    base: `${diaEgreso} de ${diasDelMes} días`,
    monto: (sueldo / diasDelMes) * diaEgreso,
  });

  const inicioSemestre = new Date(egreso.getFullYear(), egreso.getMonth() < 6 ? 0 : 6, 1);
  const desdeSemestre = ingreso > inicioSemestre ? ingreso : inicioSemestre;
  const diasSemestre = diasEntre(desdeSemestre, egreso) + 1;
  renglones.push({
    id: "sac",
    concepto: "Aguinaldo (SAC) proporcional",
    base: `Art. 123 LCT · ${diasSemestre} días del semestre`,
    monto: (sueldo / 2) * (diasSemestre / (diasEntre(inicioSemestre, sumarMeses(inicioSemestre, 6)))),
  });

  const inicioAnio = new Date(egreso.getFullYear(), 0, 1);
  const desdeAnio = ingreso > inicioAnio ? ingreso : inicioAnio;
  const diasAnio = diasEntre(desdeAnio, egreso) + 1;
  const vacacionesAnuales = diasDeVacaciones(anios);
  const diasVacaciones = (vacacionesAnuales * diasAnio) / 365;
  renglones.push({
    id: "vacaciones",
    concepto: "Vacaciones no gozadas proporcionales",
    base: `Art. 156 LCT · ${diasVacaciones.toFixed(1).replace(".", ",")} de ${vacacionesAnuales} días`,
    monto: (sueldo / 25) * diasVacaciones,
  });

  const total = renglones.reduce((acc, r) => acc + r.monto, 0);

  const partes = [];
  if (anios > 0) partes.push(`${anios} ${anios === 1 ? "año" : "años"}`);
  if (mesesRestantes > 0) partes.push(`${mesesRestantes} ${mesesRestantes === 1 ? "mes" : "meses"}`);
  const antiguedadTexto = partes.length ? partes.join(" y ") : "menos de un mes";

  return { renglones, total, antiguedadTexto, enPeriodoDePrueba };
}
