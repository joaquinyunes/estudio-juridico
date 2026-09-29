type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;

/** Envía un evento a GA4 si el script está cargado (ver layout.tsx). */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, params);
}
