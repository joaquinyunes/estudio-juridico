/**
 * Piezas de seguridad compartidas por el formulario (`/api/lead`) y el candado del
 * panel (`proxy.ts`). Sin dependencias, para probarlas solas (tests/seguridad.test.ts).
 */

type Cabeceras = { get(nombre: string): string | null };

/**
 * IP del cliente para contar intentos.
 * - En Vercel manda el encabezado que pone la plataforma (el cliente no puede escribirlo).
 * - Fuera de Vercel se usa la ÚLTIMA entrada de x-forwarded-for: la agrega el proxy de
 *   confianza; las de la izquierda las escribe el cliente y no valen (si no, rotar el
 *   encabezado evitaría cualquier tope). Los encabezados `x-vercel-*` y `x-real-ip` se
 *   ignoran: cualquiera puede mandarlos.
 * shortcut: detrás de dos proxies (CDN + hosting) la última entrada es la del CDN y todos
 * comparten tope; si pasa, cargar TRUSTED_PROXY_HOPS y tomar la entrada correspondiente.
 */
export function ipDelCliente(h: Cabeceras, enVercel: boolean = process.env.VERCEL === "1"): string {
  if (enVercel) {
    const v = h.get("x-vercel-forwarded-for") ?? h.get("x-real-ip");
    if (v) return v.split(",")[0].trim();
  }
  const partes = (h.get("x-forwarded-for") ?? "").split(",").map((p) => p.trim()).filter(Boolean);
  return partes[partes.length - 1] ?? "anon";
}

/**
 * Defensa contra POST desde otros sitios (CSRF y spam desde páginas ajenas): si el
 * navegador manda Origin o Sec-Fetch-Site, tienen que ser del propio sitio. Sin esos
 * encabezados (curl, apps) pasa: no hay forma de distinguirlos, para eso están los topes.
 */
export function mismoOrigen(h: Cabeceras): boolean {
  const fetchSite = h.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;
  const origen = h.get("origin");
  if (origen === null) return true;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  try {
    return host !== null && new URL(origen).host === host;
  } catch {
    return false; // «null» (iframes sandboxed) o basura
  }
}

/** Enlaces permitidos en textos que edita el estudio: del propio sitio o http(s). Nada de javascript:, data: ni «//». */
export function enlaceSeguro(url: string | undefined | null): string | undefined {
  const u = url?.trim();
  if (!u) return undefined;
  if (u.startsWith("/") && !u.startsWith("//")) return u;
  return /^https?:\/\//i.test(u) ? u : undefined;
}

/** CR, LF, NUL y demás caracteres de control (y separadores de línea Unicode). */
export function tieneControl(s: string): boolean {
  return /[\u0000-\u001f\u007f\u2028\u2029]/.test(s);
}

/**
 * Contador de eventos por clave dentro de una ventana de tiempo, en memoria.
 * shortcut: vive en cada instancia del servidor (en Vercel pueden ser varias): frena el
 * abuso básico, no un ataque distribuido; para algo firme, un almacén compartido (Upstash).
 */
export function crearContador(ventanaMs: number, maxClaves = 5000) {
  const eventos = new Map<string, number[]>();
  const vigentes = (clave: string, ahora: number) =>
    (eventos.get(clave) ?? []).filter((t) => ahora - t < ventanaMs);
  return {
    registrar(clave: string, ahora: number = Date.now()): number {
      const lista = vigentes(clave, ahora);
      lista.push(ahora);
      eventos.set(clave, lista);
      if (eventos.size > maxClaves) {
        // Primero lo vencido; si todo es reciente, lo más viejo (nunca la clave actual).
        for (const [k, v] of eventos) if (k !== clave && ahora - v[v.length - 1] >= ventanaMs) eventos.delete(k);
        for (const k of eventos.keys()) {
          if (eventos.size <= maxClaves) break;
          if (k !== clave) eventos.delete(k);
        }
      }
      return lista.length;
    },
    cuenta: (clave: string, ahora: number = Date.now()) => vigentes(clave, ahora).length,
    borrar: (clave: string) => void eventos.delete(clave),
    tamano: () => eventos.size,
  };
}
