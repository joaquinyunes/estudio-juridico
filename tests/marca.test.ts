// Guarda de la plantilla: el nombre, el fundador y el año del estudio viven solo en
// `src/lib/content.ts` (y se pisan desde Sanity). Si alguien los escribe de nuevo en
// un componente o una página, esta prueba falla.
import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function archivos(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const ruta = join(dir, n);
    return statSync(ruta).isDirectory() ? archivos(ruta) : /\.(ts|tsx)$/.test(n) ? [ruta] : [];
  });
}

const PERMITIDOS = new Set([join("src", "lib", "content.ts")]);

test("ningún componente ni página lleva escrita la marca del estudio de ejemplo", () => {
  const hallazgos: string[] = [];
  for (const archivo of archivos("src")) {
    if (PERMITIDOS.has(archivo)) continue;
    readFileSync(archivo, "utf8")
      .split("\n")
      .forEach((linea, i) => {
        // El dominio de ejemplo de SITE_URL es un valor por defecto que se pisa con NEXT_PUBLIC_SITE_URL.
        if (/iturbelavalle\.example/.test(linea)) return;
        if (/Iturbe|Lavalle|\b1987\b|Talcahuano/.test(linea)) hallazgos.push(`${archivo}:${i + 1}: ${linea.trim()}`);
      });
  }
  assert.deepEqual(hallazgos, []);
});
