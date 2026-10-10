import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Candado del panel de administración (/studio).
 *
 * Primera barrera: usuario y contraseña (ADMIN_USER / ADMIN_PASSWORD) antes de
 * entregar siquiera la pantalla del panel. Segunda barrera: Sanity, que solo
 * deja editar a los usuarios invitados al proyecto.
 *
 * Sin ADMIN_PASSWORD el panel queda cerrado en producción (falla cerrado).
 */

const REALM = 'Basic realm="Panel del estudio", charset="UTF-8"';
const VENTANA_MS = 15 * 60 * 1000;
const MAX_FALLOS = 8;
const fallos = new Map<string, number[]>();

/** Comparación en tiempo constante (evita filtrar la contraseña por tiempos). */
function iguales(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  let diferencia = ea.length ^ eb.length;
  const largo = Math.max(ea.length, eb.length);
  for (let i = 0; i < largo; i++) diferencia |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return diferencia === 0;
}

function leerCredenciales(cabecera: string | null): { usuario: string; clave: string } | null {
  if (!cabecera?.startsWith("Basic ")) return null;
  try {
    const bytes = Uint8Array.from(atob(cabecera.slice(6)), (c) => c.charCodeAt(0));
    const texto = new TextDecoder().decode(bytes);
    const corte = texto.indexOf(":");
    if (corte < 0) return null;
    return { usuario: texto.slice(0, corte), clave: texto.slice(corte + 1) };
  } catch {
    return null;
  }
}

function respuesta(status: number, cuerpo: string, extra: Record<string, string> = {}) {
  return new NextResponse(cuerpo, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      ...extra,
    },
  });
}

export function proxy(request: NextRequest) {
  const clave = process.env.ADMIN_PASSWORD;
  const usuario = process.env.ADMIN_USER ?? "admin";

  if (!clave) {
    // Desarrollo local: se puede entrar sin contraseña. En producción, nunca.
    if (process.env.NODE_ENV === "development") return NextResponse.next();
    return respuesta(404, "No encontrado");
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const ahora = Date.now();
  const recientes = (fallos.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  if (recientes.length >= MAX_FALLOS) {
    return respuesta(429, "Demasiados intentos. Probá de nuevo en unos minutos.", {
      "Retry-After": "900",
    });
  }

  const enviadas = leerCredenciales(request.headers.get("authorization"));
  // Se evalúan las dos comparaciones siempre, sin cortocircuito.
  const usuarioOk = iguales(enviadas?.usuario ?? "", usuario);
  const claveOk = iguales(enviadas?.clave ?? "", clave);

  if (enviadas && usuarioOk && claveOk) {
    fallos.delete(ip);
    return NextResponse.next({ headers: { "Cache-Control": "no-store" } });
  }

  if (enviadas) {
    recientes.push(ahora);
    fallos.set(ip, recientes);
  }
  return respuesta(401, "Acceso restringido", { "WWW-Authenticate": REALM });
}

export const config = {
  matcher: ["/studio", "/studio/:path*"],
};
