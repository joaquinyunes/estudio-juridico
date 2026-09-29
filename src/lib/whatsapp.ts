const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5491100000000";

export function buildWhatsAppLink(mensaje: string, numero = WHATSAPP_NUMBER): string {
  return `https://wa.me/${numero.replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`;
}

export function buildMensajeCalificado(params: {
  area: string;
  resumen: string;
  nombre?: string;
  urgencia?: string;
}): string {
  const { area, resumen, nombre, urgencia } = params;
  const saludo = nombre ? `Hola, soy ${nombre}.` : "Hola.";
  const plazo = urgencia ? ` Urgencia: ${urgencia}.` : "";
  return `${saludo} Quiero una consulta sobre ${area}.${plazo} Resumen de mi caso: ${resumen}`;
}
