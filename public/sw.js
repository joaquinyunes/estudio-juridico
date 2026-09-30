/*
 * Service worker de Iturbe & Lavalle.
 *
 * - Páginas: primero la red (contenido siempre fresco); sin conexión, la última
 *   versión guardada o la página /offline.
 * - Archivos estáticos con hash (/_next/static, íconos, fotos): primero el caché.
 * - Imágenes optimizadas: se sirven del caché y se actualizan en segundo plano.
 * - Nunca intercepta /api, /studio ni peticiones a otros dominios.
 *
 * Para forzar una actualización en todos los teléfonos, subir VERSION.
 */
const VERSION = "v1";
const CACHE_PAGINAS = `paginas-${VERSION}`;
const CACHE_ESTATICOS = `estaticos-${VERSION}`;
const CACHE_IMAGENES = `imagenes-${VERSION}`;
const CACHES_VIGENTES = [CACHE_PAGINAS, CACHE_ESTATICOS, CACHE_IMAGENES];

// Páginas que quedan disponibles sin conexión desde la instalación.
const PRECARGA = ["/offline", "/calculadora-indemnizacion", "/"];

/** Guarda una página y los CSS/JS que referencia, para que funcione offline. */
async function precargarPagina(url) {
  const respuesta = await fetch(url, { credentials: "same-origin" });
  if (!respuesta.ok) return;
  const html = await respuesta.clone().text();
  await (await caches.open(CACHE_PAGINAS)).put(url, respuesta);
  const recursos = [...new Set(html.match(/\/_next\/static\/[^"'\s)]+/g) || [])];
  const estaticos = await caches.open(CACHE_ESTATICOS);
  await Promise.all(recursos.map((r) => estaticos.add(r).catch(() => undefined)));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all(PRECARGA.map((url) => precargarPagina(url).catch(() => undefined))).then(() =>
      self.skipWaiting(),
    ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((claves) =>
        Promise.all(claves.filter((c) => !CACHES_VIGENTES.includes(c)).map((c) => caches.delete(c))),
      )
      .then(() => self.clients.claim()),
  );
});

async function primeroRed(request) {
  const cache = await caches.open(CACHE_PAGINAS);
  try {
    const respuesta = await fetch(request);
    if (respuesta.ok) cache.put(request, respuesta.clone());
    return respuesta;
  } catch {
    const guardada = await cache.match(request, { ignoreSearch: request.mode === "navigate" });
    if (guardada) return guardada;
    if (request.mode === "navigate") {
      const offline = await cache.match("/offline");
      if (offline) return offline;
    }
    return Response.error();
  }
}

async function primeroCache(request, nombreCache) {
  const cache = await caches.open(nombreCache);
  const guardada = await cache.match(request);
  if (guardada) return guardada;
  const respuesta = await fetch(request);
  if (respuesta.ok) cache.put(request, respuesta.clone());
  return respuesta;
}

async function cacheYActualizar(request, nombreCache) {
  const cache = await caches.open(nombreCache);
  const guardada = await cache.match(request);
  const red = fetch(request)
    .then((respuesta) => {
      if (respuesta.ok) cache.put(request, respuesta.clone());
      return respuesta;
    })
    .catch(() => guardada);
  return guardada || red;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (/^\/(api|studio|_vercel)(\/|$)/.test(url.pathname)) return;

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(primeroCache(request, CACHE_ESTATICOS));
    return;
  }

  if (
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/img/") ||
    url.pathname === "/manifest.webmanifest"
  ) {
    event.respondWith(cacheYActualizar(request, CACHE_IMAGENES));
    return;
  }

  // Navegaciones y datos de React Server Components de las páginas.
  if (request.mode === "navigate" || request.headers.get("RSC") === "1") {
    event.respondWith(primeroRed(request));
  }
});
