// Pruebas de humo contra el sitio compilado: corré `npm run build` antes.
// Arranca `next start` en un puerto libre y recorre las rutas públicas y el formulario.
import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:net";

let servidor: ChildProcess;
let base = "";
const rutas: string[] = [];

async function puertoLibre(): Promise<number> {
  return new Promise((ok) => {
    const s = createServer().listen(0, () => {
      const { port } = s.address() as { port: number };
      s.close(() => ok(port));
    });
  });
}

before(async () => {
  assert.ok(existsSync(".next/BUILD_ID"), "Falta el build: corré `npm run build` antes de `npm test`");
  const puerto = await puertoLibre();
  base = `http://127.0.0.1:${puerto}`;
  // Sin ADMIN_PASSWORD ni claves: el sitio debe funcionar con el contenido de respaldo.
  const env: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: "production" };
  for (const k of ["ADMIN_PASSWORD", "ADMIN_TOTP_SECRET", "RESEND_API_KEY", "SANITY_API_TOKEN", "SANITY_LEADS_DATASET"]) delete env[k];
  servidor = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(puerto)], { env, stdio: "ignore" });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base + "/robots.txt")).ok) break;
    } catch {
      // el servidor todavía está arrancando
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  const mapa = await (await fetch(base + "/sitemap.xml")).text();
  for (const [, loc] of mapa.matchAll(/<loc>([^<]+)<\/loc>/g)) rutas.push(new URL(loc).pathname);
  rutas.push("/offline");
});

after(() => {
  servidor?.kill();
});

test("el sitemap lista las páginas del sitio", () => {
  assert.ok(rutas.length >= 14, `Se esperaban al menos 14 rutas, hay ${rutas.length}`);
});

test("cada ruta responde 200, con un solo <h1> y título", async () => {
  for (const ruta of rutas) {
    const r = await fetch(base + ruta);
    assert.equal(r.status, 200, ruta);
    const html = await r.text();
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, `${ruta}: debe tener un solo <h1>`);
    assert.match(html, /<title>[^<]{5,}<\/title>/, `${ruta}: sin título`);
  }
});

test("una ruta inexistente da 404", async () => {
  assert.equal((await fetch(base + "/no-existe-xyz")).status, 404);
});

test("encabezados de seguridad: CSP aplicada (no solo reporte), nosniff, HSTS", async () => {
  const r = await fetch(base + "/");
  const csp = r.headers.get("content-security-policy") ?? "";
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /object-src 'none'/);
  assert.equal(r.headers.get("x-content-type-options"), "nosniff");
  assert.match(r.headers.get("strict-transport-security") ?? "", /max-age=\d+/);
});

test("/.well-known/security.txt existe", async () => {
  const r = await fetch(base + "/.well-known/security.txt");
  assert.equal(r.status, 200);
  assert.match(await r.text(), /^Contact:/m);
});

test("/studio queda cerrado (404) cuando no hay ADMIN_PASSWORD", async () => {
  assert.equal((await fetch(base + "/studio")).status, 404);
});

let ipN = 0;
const lead = (cuerpo: unknown, extra: Record<string, string> = {}) =>
  fetch(base + "/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `198.51.100.${++ipN}`, ...extra },
    body: typeof cuerpo === "string" ? cuerpo : JSON.stringify(cuerpo),
  });

const valido = {
  nombre: "Ana Prueba",
  area: "laboral",
  resumen: "Me despidieron sin causa y quiero saber qué me corresponde.",
  acepta: true,
};

test("formulario: una consulta válida se acepta", async () => {
  const r = await lead(valido);
  assert.equal(r.status, 200);
  assert.equal((await r.json()).ok, true);
});

test("formulario: datos inválidos dan 400", async () => {
  assert.equal((await lead({ nombre: "A" })).status, 400);
  assert.equal((await lead({ ...valido, resumen: "corto" })).status, 400);
  assert.equal((await lead("no es json")).status, 400);
});

test("formulario: sin consentimiento (acepta) se rechaza aunque el resto sea válido", async () => {
  assert.equal((await lead({ ...valido, acepta: false })).status, 400);
  assert.equal((await lead({ ...valido, acepta: undefined })).status, 400);
});

test("formulario: otro Content-Type da 415 y un cuerpo enorme 413", async () => {
  const r415 = await fetch(base + "/api/lead", { method: "POST", headers: { "content-type": "text/plain" }, body: "x" });
  assert.equal(r415.status, 415);
  assert.equal((await lead({ ...valido, resumen: "a".repeat(20_000) })).status, 413);
});

test("formulario: el honeypot responde OK sin registrar nada", async () => {
  const r = await lead({ ...valido, empresa: "Spam SA" });
  assert.deepEqual(await r.json(), { ok: true });
});

test("formulario: más de 5 envíos por IP en la ventana dan 429", async () => {
  const ip = { "x-forwarded-for": "192.0.2.77" };
  const estados: number[] = [];
  for (let i = 0; i < 7; i++) estados.push((await lead(valido, ip)).status);
  assert.deepEqual(estados.slice(0, 5), [200, 200, 200, 200, 200]);
  assert.equal(estados[6], 429);
});

test("el formulario no acepta GET (solo POST)", async () => {
  assert.equal((await fetch(base + "/api/lead")).status, 405);
});
