import test from "node:test";
import assert from "node:assert/strict";
import { codigoTotp, decodificarBase32, verificarTotp } from "../src/lib/totp.ts";

// Secreto de prueba del RFC 6238 ("12345678901234567890") en base32.
const SECRETO = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";

test("base32 decodifica el secreto del RFC", () => {
  assert.equal(new TextDecoder().decode(decodificarBase32(SECRETO)), "12345678901234567890");
});

test("vectores del RFC 6238 (últimos 6 dígitos de los de 8)", async () => {
  assert.equal(await codigoTotp(SECRETO, 59_000), "287082");
  assert.equal(await codigoTotp(SECRETO, 1_111_111_109_000), "081804");
  assert.equal(await codigoTotp(SECRETO, 1_234_567_890_000), "005924");
});

test("acepta ±1 ventana y rechaza el resto o formatos inválidos", async () => {
  const t = 1_234_567_890_000;
  assert.equal(await verificarTotp(SECRETO, "005924", t), true);
  assert.equal(await verificarTotp(SECRETO, "005924", t + 30_000), true);
  assert.equal(await verificarTotp(SECRETO, "005924", t + 90_000), false);
  assert.equal(await verificarTotp(SECRETO, "00592", t), false);
  assert.equal(await verificarTotp(SECRETO, "abcdef", t), false);
});

test("un secreto que no es base32 falla (no acepta todo)", async () => {
  await assert.rejects(() => codigoTotp("¡no-es-base32!", 0));
});
