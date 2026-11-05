// Capturas del sitio para el caso de éxito y el manual. Uso:
//   PLAYWRIGHT_CHANNEL=chrome node scripts/capturas.mjs [URL_BASE]
import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const base = process.argv[2] ?? "https://estudio-juridico-tau.vercel.app";
const paginas = [
  ["inicio", "/"],
  ["contacto", "/contacto"],
  ["area-laboral", "/areas/laboral"],
  ["calculadora", "/calculadora-indemnizacion"],
];
mkdirSync("docs/capturas", { recursive: true });
const navegador = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
for (const [nombre, ancho, alto] of [["escritorio", 1280, 800], ["celular", 375, 740]]) {
  const pagina = await navegador.newPage({ viewport: { width: ancho, height: alto }, reducedMotion: "reduce" });
  for (const [id, ruta] of paginas) {
    await pagina.goto(base + ruta, { waitUntil: "networkidle" });
    await pagina.screenshot({ path: `docs/capturas/${id}-${nombre}.jpg`, type: "jpeg", quality: 78 });
  }
  await pagina.close();
}
await navegador.close();
