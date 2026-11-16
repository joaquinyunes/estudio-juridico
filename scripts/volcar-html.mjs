// Guarda el HTML normalizado de todas las rutas del sitio compilado, para comparar
// antes/después de un cambio de refactor (las rutas del estudio actual deben quedar iguales).
// Uso: node scripts/volcar-html.mjs <carpeta-salida>   (requiere `npm run build`)
// Comparar: diff -r carpetaA carpetaB
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdirSync, writeFileSync } from "node:fs";

const salida = process.argv[2];
if (!salida) throw new Error("Uso: node scripts/volcar-html.mjs <carpeta-salida>");
mkdirSync(salida, { recursive: true });

const puerto = await new Promise((ok) => {
  const s = createServer().listen(0, () => {
    const { port } = s.address();
    s.close(() => ok(port));
  });
});
const base = `http://127.0.0.1:${puerto}`;
const env = { ...process.env, NODE_ENV: "production" };
const servidor = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(puerto)], { env, stdio: "ignore" });

// Scripts y hashes de chunks cambian en cada build; lo que se compara es el HTML visible.
const normalizar = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/(\/_next\/(?:static|image)[^"' )]*)/g, (m) => m.replace(/[A-Za-z0-9_-]{8,}(?=\.(?:js|css|woff2|png|jpg|webp|avif))/g, "H").replace(/dpl=[^&"']+/g, "dpl=X"))
    .replace(/<link[^>]+rel="preload"[^>]*>/g, "")
    .replace(/<!-- -->/g, "") // separadores de React entre nodos de texto: el texto visible es el mismo
    .replace(/<lastmod>[^<]*<\/lastmod>/g, "<lastmod>X</lastmod>")
    .replace(/(opengraph-image)\?[0-9a-f]+/g, "$1?H")
    .replace(/></g, ">\n<");

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
  rutas.push("/offline", "/manifest.webmanifest", "/opengraph-image", "/robots.txt", "/sitemap.xml");
  for (const ruta of rutas) {
    const r = await fetch(base + ruta);
    const cuerpo = ruta === "/opengraph-image" ? `${r.status} ${r.headers.get("content-type")} ${(await r.arrayBuffer()).byteLength}` : normalizar(await r.text());
    writeFileSync(`${salida}/${ruta === "/" ? "_inicio" : ruta.slice(1).replace(/[\/]/g, "__")}.txt`, `${r.status}\n${cuerpo}`);
  }
  console.log(`${rutas.length} rutas guardadas en ${salida}`);
} finally {
  servidor.kill();
}
