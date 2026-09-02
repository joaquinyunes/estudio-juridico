const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5491100000000";

export function buildWhatsAppLink(mensaje: string): string {
  const numero = WHATSAPP_NUMBER.replace(/\D/g, "");
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

export function buildMensajeCalificado(params: {
  area: string;
  resumen: string;
  nombre?: string;
}): string {
  const { area, resumen, nombre } = params;
  const saludo = nombre ? `Hola, soy ${nombre}.` : "Hola.";
  return `${saludo} Quiero una consulta sobre ${area}. Resumen de mi caso: ${resumen}`;
}
