// Genera un secreto TOTP (base32) para ADMIN_TOTP_SECRET y el enlace para la app
// autenticadora. Uso: node scripts/generar-totp.mjs [usuario]
// El secreto se imprime una sola vez: cargalo en Vercel y en tu app, no lo commitees.
import { randomBytes } from "node:crypto";

const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
let bits = "";
for (const b of randomBytes(20)) bits += b.toString(2).padStart(8, "0");
let secreto = "";
for (let i = 0; i < bits.length; i += 5) secreto += ALFABETO[parseInt(bits.slice(i, i + 5), 2)];

const usuario = encodeURIComponent(process.argv[2] ?? "admin");
console.log(`ADMIN_TOTP_SECRET=${secreto}`);
console.log(`otpauth://totp/Estudio%20juridico:${usuario}?secret=${secreto}&issuer=Estudio%20juridico`);
