/**
 * Textos del sitio que dependen del estudio (nombre, año de fundación, ciudad,
 * cantidad de abogados…), resueltos desde `datosDelEstudio`. Sin dependencias
 * para poder probarlo solo.
 *
 * Los textos de `datosDelEstudio` pueden llevar marcadores que se completan acá:
 *   {nombre} {fundador} {ciudad} {fundacion}
 *   {anios} / {Anios}       años de trayectoria en letras («treinta y nueve» / «Treinta y nueve»)
 *   {abogados} / {Abogados} cantidad de abogados del equipo en letras
 *   {areas} / {Areas}       cantidad de áreas de práctica en letras
 */

const UNIDADES = [
  "cero", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
  "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve",
  "veinte", "veintiún", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve",
];
const DECENAS = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];

/** 0–99 en letras, con «un» delante de sustantivo («treinta y un años»). Desde 100, el número. */
export function numeroEnPalabras(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 99) return String(n);
  if (n < 30) return UNIDADES[n];
  const u = n % 10;
  return DECENAS[Math.floor(n / 10)] + (u ? ` y ${UNIDADES[u]}` : "");
}

const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export type DatosDeMarca = {
  nombre: string;
  fundador: string;
  ciudad: string;
  fundacion: number;
};

export function rellenar(
  texto: string,
  datos: DatosDeMarca,
  cuentas: { abogados: number; areas: number },
  anioActual: number = new Date().getFullYear(),
): string {
  const anios = numeroEnPalabras(Math.max(anioActual - datos.fundacion, 0));
  const abogados = numeroEnPalabras(cuentas.abogados);
  const areas = numeroEnPalabras(cuentas.areas);
  const valores: Record<string, string> = {
    nombre: datos.nombre,
    fundador: datos.fundador,
    ciudad: datos.ciudad,
    fundacion: String(datos.fundacion),
    anios,
    Anios: capitalizar(anios),
    abogados,
    Abogados: capitalizar(abogados),
    areas,
    Areas: capitalizar(areas),
  };
  // Un marcador desconocido se deja tal cual (se nota en pantalla y en las pruebas).
  return texto.replace(/\{(\w+)\}/g, (m, clave: string) =>
    Object.hasOwn(valores, clave) ? valores[clave] : m,
  );
}

export const CLAVES_DE_TEXTO = [
  "descripcionSitio",
  "heroBajada",
  "estudioTitulo",
  "estudioTituloEnfasis",
  "estudioParrafo",
  "historiaTitulo",
  "historiaTituloEnfasis",
  "historiaBajada",
  "equipoTitulo",
  "equipoTituloEnfasis",
  "contactoDescripcion",
] as const;

export type TextosDelEstudio = Record<(typeof CLAVES_DE_TEXTO)[number], string>;

/** Todos los textos de marca ya completados con los datos y las cuentas del estudio. */
export function resolverTextos(
  datos: DatosDeMarca & Record<(typeof CLAVES_DE_TEXTO)[number], string>,
  cuentas: { abogados: number; areas: number },
  anioActual?: number,
): TextosDelEstudio {
  return Object.fromEntries(
    CLAVES_DE_TEXTO.map((k) => [k, rellenar(datos[k], datos, cuentas, anioActual)]),
  ) as TextosDelEstudio;
}
