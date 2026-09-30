"use client";

import { useEffect } from "react";

/**
 * Registra /sw.js solo en producción (en desarrollo interferiría con la recarga
 * en caliente). Se difiere hasta que el navegador está ocioso para que la
 * precarga offline no compita con la primera carga de la página.
 */
export function RegistrarServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    let temporizador: ReturnType<typeof setTimeout> | undefined;
    const registrar = () => {
      const alOcio = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1));
      temporizador = setTimeout(
        () =>
          alOcio(() => {
            navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((err) => {
              console.error("No se pudo registrar el service worker", err);
            });
          }),
        3000,
      );
    };

    if (document.readyState === "complete") registrar();
    else window.addEventListener("load", registrar, { once: true });
    return () => {
      window.removeEventListener("load", registrar);
      clearTimeout(temporizador);
    };
  }, []);

  return null;
}
