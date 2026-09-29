"use client";

import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

type Props = {
  mensaje: string;
  children: React.ReactNode;
  className?: string;
  origen?: string;
};

export function WhatsAppCTA({ mensaje, children, className, origen }: Props) {
  return (
    <a
      href={buildWhatsAppLink(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click", { origen })}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 rounded-full border border-tinta px-6 py-3 font-medium transition-colors hover:bg-tinta hover:text-papel"
      }
    >
      {children}
    </a>
  );
}
