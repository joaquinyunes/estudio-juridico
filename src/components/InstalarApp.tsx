"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type EventoInstalacion = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const noSuscribe = () => () => {};

function yaInstalada() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** Safari de iPhone/iPad: no tiene aviso de instalación, hay que explicarlo. */
function esSafariIOS() {
  const ua = navigator.userAgent;
  const ios = /iphone|ipad|ipod/i.test(ua) || (ua.includes("Mac") && navigator.maxTouchPoints > 1);
  return ios && !/crios|fxios|edgios/i.test(ua);
}

/**
 * Ofrece instalar el sitio como app. Android/Chrome: botón que abre el aviso
 * nativo. iPhone: instrucciones de "Compartir → Agregar a inicio". Si ya está
 * instalada (o el navegador no lo permite), no muestra nada.
 */
export function InstalarApp({ className = "" }: { className?: string }) {
  const [evento, setEvento] = useState<EventoInstalacion | null>(null);
  const [instalada, setInstalada] = useState(false);
  const [verPasosIOS, setVerPasosIOS] = useState(false);

  const standalone = useSyncExternalStore(noSuscribe, yaInstalada, () => true);
  const ios = useSyncExternalStore(noSuscribe, esSafariIOS, () => false);

  useEffect(() => {
    const alOfrecer = (e: Event) => {
      e.preventDefault();
      setEvento(e as EventoInstalacion);
    };
    const alInstalar = () => {
      setInstalada(true);
      setEvento(null);
    };
    window.addEventListener("beforeinstallprompt", alOfrecer);
    window.addEventListener("appinstalled", alInstalar);
    return () => {
      window.removeEventListener("beforeinstallprompt", alOfrecer);
      window.removeEventListener("appinstalled", alInstalar);
    };
  }, []);

  if (standalone || instalada || (!evento && !ios)) return null;

  const instalar = async () => {
    if (!evento) {
      setVerPasosIOS((v) => !v);
      return;
    }
    await evento.prompt();
    const { outcome } = await evento.userChoice;
    if (outcome === "accepted") setInstalada(true);
    setEvento(null);
  };

  return (
    <div className={`rounded-md border border-linea bg-papel-2 p-5 ${className}`}>
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- ícono chico, estático */}
        <img src="/icons/icon-192.png" alt="" width={44} height={44} loading="lazy" className="rounded-xl" />
        <div className="flex-1">
          <p className="font-medium">Tené el estudio en tu celular</p>
          <p className="text-sm text-tinta-3">Consultá y calculá sin abrir el navegador.</p>
        </div>
      </div>
      <button
        type="button"
        onClick={instalar}
        aria-expanded={ios ? verPasosIOS : undefined}
        className="mt-4 w-full rounded-full bg-tinta px-5 py-3 text-sm font-medium text-papel"
      >
        {evento ? "Instalar la app" : "Cómo instalarla"}
      </button>
      {ios && verPasosIOS && (
        <ol className="mt-4 space-y-2 text-sm text-tinta-2">
          <li>
            1. Tocá <strong className="font-medium">Compartir</strong>{" "}
            <svg viewBox="0 0 24 24" className="inline h-4 w-4 -translate-y-px" aria-label="ícono de compartir">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v12M8 7l4-4 4 4M5 11v9h14v-9"
              />
            </svg>{" "}
            en la barra de Safari.
          </li>
          <li>
            2. Elegí <strong className="font-medium">Agregar a inicio</strong>.
          </li>
        </ol>
      )}
    </div>
  );
}
