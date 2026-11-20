// Accesibilidad (axe-core, WCAG 2.1 A/AA) sobre todas las páginas del sitio compilado.
// Uso: npm run build && npm run test:a11y
// En CI se usa el Chromium de Playwright; en local, PLAYWRIGHT_CHANNEL=chrome usa tu Chrome.
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";

const axeFuente = readFileSync("node_modules/axe-core/axe.min.js", "utf8");

const puerto = await new Promise((ok) => {
  const s = createServer().listen(0, () => {
    const { port } = s.address();
    s.close(() => ok(port));
  });
});
const base = `http://127.0.0.1:${puerto}`;
const servidor = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(puerto)], {
  stdio: "ignore",
});

let fallos = 0;
const violacionesCsp = [];
try {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base + "/robots.txt")).ok) break;
    } catch {
      // arrancando
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  const mapa = await (await fetch(base + "/sitemap.xml")).text();
  const rutas = [...mapa.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  rutas.push("/offline");

  const navegador = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  for (const ancho of [1280, 375]) {
    // reducedMotion: las animaciones por scroll (p. ej. el sello «Resuelto») se miden en su
    // estado final; a medio animar axe ve opacidad parcial y da falsos contrastes.
    const pagina = await navegador.newPage({ viewport: { width: ancho, height: 900 }, reducedMotion: "reduce" });
    let rutaActual = "";
    // La CSP está en modo bloqueo: cualquier recurso legítimo que se bloquee aparece en la consola.
    pagina.on("console", (m) => {
      if (/Content Security Policy/i.test(m.text())) violacionesCsp.push(`${rutaActual} (${ancho}px): ${m.text().slice(0, 160)}`);
    });
    for (const ruta of rutas) {
      rutaActual = ruta;
      await pagina.goto(base + ruta, { waitUntil: "networkidle" });
      await pagina.addScriptTag({ content: axeFuente });
      const { violations } = await pagina.evaluate(() =>
        axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } }),
      );
      if (violations.length) {
        fallos += violations.length;
        console.error(`✖ ${ruta} (${ancho}px)`);
        for (const v of violations) console.error(`   ${v.id}: ${v.help} — ${v.nodes.length} elemento(s), p. ej. ${v.nodes[0].target}`);
      } else {
        console.log(`✔ ${ruta} (${ancho}px): 0 violaciones`);
      }
    }
    await pagina.close();
  }
  await navegador.close();
} finally {
  servidor.kill();
}
if (violacionesCsp.length) {
  fallos += violacionesCsp.length;
  console.error("Violaciones de CSP:"+"\n"+violacionesCsp.join("\n"));
} else {
  console.log("✔ CSP: ninguna violación en consola en todas las páginas");
}
if (fallos) {
  console.error(`\n${fallos} violación(es) de accesibilidad`);
  process.exit(1);
}
