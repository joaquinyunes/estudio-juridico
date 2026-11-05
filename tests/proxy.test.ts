import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { proxy } from "../src/proxy.ts";
import { codigoTotp } from "../src/lib/totp.ts";

const CLAVE = "clave-de-prueba-larga-1";
const SECRETO = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";
let n = 0;

function pedir(auth?: string, ip = `10.0.0.${++n}`) {
  const headers: Record<string, string> = { "x-forwarded-for": ip };
  if (auth) headers.authorization = "Basic " + Buffer.from(auth).toString("base64");
  return proxy(new NextRequest("http://localhost/studio", { headers }));
}

beforeEach(() => {
  process.env.ADMIN_USER = "admin";
  process.env.ADMIN_PASSWORD = CLAVE;
  delete process.env.ADMIN_TOTP_SECRET;
  (process.env as Record<string, string>).NODE_ENV = "production";
});

test("sin ADMIN_PASSWORD el panel queda cerrado (404)", async () => {
  delete process.env.ADMIN_PASSWORD;
  assert.equal((await pedir(`admin:${CLAVE}`)).status, 404);
});

test("contraseña de menos de 12 caracteres: cerrado aunque coincida", async () => {
  process.env.ADMIN_PASSWORD = "corta123";
  assert.equal((await pedir("admin:corta123")).status, 404);
});

test("sin credenciales o con credenciales malas: 401 con WWW-Authenticate", async () => {
  const sin = await pedir();
  assert.equal(sin.status, 401);
  assert.ok(sin.headers.get("www-authenticate")?.startsWith("Basic"));
  assert.equal((await pedir("admin:mala")).status, 401);
  assert.equal((await pedir(`otro:${CLAVE}`)).status, 401);
});

test("credenciales correctas pasan (200) y no se cachean", async () => {
  const r = await pedir(`admin:${CLAVE}`);
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("cache-control"), "no-store");
});

test("con 2FA: la clave sola o con código malo no entra; con código vigente sí", async () => {
  process.env.ADMIN_TOTP_SECRET = SECRETO;
  assert.equal((await pedir(`admin:${CLAVE}`)).status, 401);
  assert.equal((await pedir(`admin:${CLAVE}000000`)).status, 401);
  const codigo = await codigoTotp(SECRETO, Date.now());
  assert.equal((await pedir(`admin:${CLAVE}${codigo}`)).status, 200);
});

test("tras 8 fallos desde la misma IP responde 429, incluso con la clave correcta", async () => {
  const ip = "203.0.113.9";
  for (let i = 0; i < 8; i++) assert.equal((await pedir("admin:mala", ip)).status, 401);
  const r = await pedir(`admin:${CLAVE}`, ip);
  assert.equal(r.status, 429);
  assert.equal(r.headers.get("retry-after"), "900");
});
