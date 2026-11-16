// Arma docs/manual-del-estudio.pdf a partir de docs/guia-del-panel.md (con las capturas
// de docs/capturas/ dentro del PDF). Uso: PLAYWRIGHT_CHANNEL=chrome node scripts/generar-manual.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { marked } from "marked";
import { chromium } from "playwright-core";
import { datosDelEstudio } from "../src/lib/content.ts";

const md = readFileSync("docs/guia-del-panel.md", "utf8").replace(/^# [^\n]*\n/, ""); // el título lo pone la portada del PDF
let cuerpo = await marked.parse(md);
// Las capturas van dentro del PDF (data URI), no como archivos sueltos.
cuerpo = cuerpo.replace(/src="(capturas\/[^"]+)"/g, (_, ruta) => `src="data:image/jpeg;base64,${readFileSync(`docs/${ruta}`).toString("base64")}"`);

const hoy = new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
const html = `<!doctype html><html lang="es-AR"><meta charset="utf-8"><title>Manual del estudio</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  body { font: 11pt/1.5 system-ui, "Segoe UI", sans-serif; color: #17150f; }
  h1 { font: 700 26pt/1.1 Georgia, serif; margin: 0 0 4pt; }
  h2 { font: 700 15pt Georgia, serif; margin: 20pt 0 6pt; break-after: avoid; }
  .sub { color: #8c2a1c; letter-spacing: .08em; text-transform: uppercase; font-size: 9pt; margin-bottom: 14pt; }
  table { border-collapse: collapse; width: 100%; font-size: 10pt; break-inside: avoid; }
  th, td { border: 1px solid #c9bfa9; padding: 4pt 6pt; text-align: left; vertical-align: top; }
  th { background: #efe7d6; }
  code { background: #efe7d6; padding: 0 3pt; border-radius: 2pt; font-size: 9.5pt; }
  blockquote { border-left: 3pt solid #8c2a1c; margin: 8pt 0; padding: 2pt 10pt; background: #f7f2e7; }
  img { max-width: 100%; max-height: 115mm; display: block; margin: 8pt auto; border: 1px solid #c9bfa9; break-inside: avoid; }
  p, li { orphans: 3; widows: 3; }
</style>
<h1>Manual del estudio</h1>
<p class="sub">${datosDelEstudio.nombre} · actualizado el ${hoy}</p>
${cuerpo}`;

if (process.env.MANUAL_HTML) writeFileSync(process.env.MANUAL_HTML, html); // para revisar el diseño sin abrir el PDF
const navegador = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
const pagina = await navegador.newPage();
await pagina.setContent(html, { waitUntil: "load" });
writeFileSync("docs/manual-del-estudio.pdf", await pagina.pdf({ format: "A4", printBackground: true, displayHeaderFooter: true, footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;color:#777"><span class="pageNumber"></span> / <span class="totalPages"></span></div>', headerTemplate: "<div></div>", margin: { top: "18mm", bottom: "18mm", left: "16mm", right: "16mm" } }));
await navegador.close();
console.log("docs/manual-del-estudio.pdf");
