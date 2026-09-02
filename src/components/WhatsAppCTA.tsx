"use client";

type Props = {
  mensaje: string;
  children: React.ReactNode;
  className?: string;
};

export function WhatsAppCTA({ mensaje, children, className }: Props) {
  const numero = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5491100000000").replace(
    /\D/g,
    ""
  );
  const href = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        if (typeof window !== "undefined" && "gtag" in window) {
          // @ts-expect-error gtag inyectado por el script de GA4
          window.gtag("event", "whatsapp_click");
        }
      }}
      className={
        className ??
        "inline-flex items-center justify-center rounded-md bg-emerald-700 px-6 py-3 text-white font-medium hover:bg-emerald-800 transition-colors"
      }
    >
      {children}
    </a>
  );
}
