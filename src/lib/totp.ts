/**
 * TOTP (RFC 6238, SHA-1, 6 dígitos, 30 s) con WebCrypto: sin dependencias, corre
 * en el proxy de Next y en las pruebas. Compatible con Google Authenticator,
 * Authy, 1Password, etc.
 */

const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function decodificarBase32(texto: string): Uint8Array {
  const limpio = texto.toUpperCase().replace(/[\s=-]/g, "");
  let bits = 0;
  let valor = 0;
  const bytes: number[] = [];
  for (const c of limpio) {
    const i = ALFABETO.indexOf(c);
    if (i < 0) throw new Error("Secreto TOTP inválido (no es base32)");
    valor = (valor << 5) | i;
    bits += 5;
    if (bits >= 8) {
      bytes.push((valor >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
}

export async function codigoTotp(secretoBase32: string, ahoraMs: number): Promise<string> {
  const clave = await crypto.subtle.importKey(
    "raw",
    decodificarBase32(secretoBase32) as BufferSource,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const contador = new ArrayBuffer(8);
  new DataView(contador).setBigUint64(0, BigInt(Math.floor(ahoraMs / 30000)));
  const h = new Uint8Array(await crypto.subtle.sign("HMAC", clave, contador));
  const o = h[h.length - 1] & 0x0f;
  const n =
    ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return String(n % 1_000_000).padStart(6, "0");
}

/** Acepta el código actual y el de la ventana anterior y la siguiente (±30 s de reloj). */
export async function verificarTotp(
  secretoBase32: string,
  codigo: string,
  ahoraMs: number = Date.now(),
): Promise<boolean> {
  if (!/^\d{6}$/.test(codigo)) return false;
  let ok = false;
  for (const delta of [-30000, 0, 30000]) {
    // Se evalúan las tres ventanas siempre, sin cortocircuito.
    if ((await codigoTotp(secretoBase32, ahoraMs + delta)) === codigo) ok = true;
  }
  return ok;
}
