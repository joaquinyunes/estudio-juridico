// Node ESM exige extensión en los subpaths de paquetes CJS ("next/server" → "next/server.js").
export async function resolve(especificador, contexto, siguiente) {
  if (/^next\/[a-z-]+$/.test(especificador)) return siguiente(especificador + ".js", contexto);
  return siguiente(especificador, contexto);
}
