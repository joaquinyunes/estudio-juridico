import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createClient } from "@sanity/client";
import { getAreas, getDatosDelEstudio } from "@/lib/cms";
import { crearContador, ipDelCliente, mismoOrigen, tieneControl } from "@/lib/seguridad";

const sinControl = (s: string) => !tieneControl(s);

const leadSchema = z.object({
  // Sin saltos de línea ni caracteres de control: el nombre va en el asunto del correo.
  nombre: z.string().trim().min(2).max(120).refine(sinControl, "caracteres no permitidos"),
  area: z.string().min(1).max(60),
  urgencia: z.enum(["inmediata", "mes", "informacion"]).optional(),
  // El resumen puede tener saltos de línea y tabulaciones, nada más de control.
  resumen: z
    .string()
    .trim()
    .min(20)
    .max(1500)
    .refine((s) => sinControl(s.replace(/[\n\r\t]/g, "")), "caracteres no permitidos"),
  // Consentimiento (Ley 25.326): se exige también acá, no solo en el navegador.
  acepta: z.literal(true),
  empresa: z.string().optional(), // honeypot
});

// Topes en memoria de cada instancia (ver shortcut en lib/seguridad.ts): por IP y,
// como respaldo ante muchas IPs, global por hora (protege la cuota de Resend y la bandeja del estudio).
const MAX_POR_IP = 5;
const porIp = crearContador(10 * 60 * 1000);
const MAX_GLOBAL = Number(process.env.LEADS_MAX_POR_HORA) || 100;
const global = crearContador(60 * 60 * 1000, 1);

const MAX_BODY_BYTES = 8 * 1024;

const escapar = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  // Un POST desde otro sitio ni siquiera consume el tope de la IP.
  if (!mismoOrigen(request.headers)) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  }
  if (porIp.registrar(ipDelCliente(request.headers)) > MAX_POR_IP || global.registrar("todos") > MAX_GLOBAL) {
    return NextResponse.json({ error: "Demasiados envíos, probá en unos minutos" }, { status: 429 });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Formato no soportado" }, { status: 415 });
  }
  // Se corta antes de leer si el cliente declara un cuerpo grande; y se vuelve a medir el
  // texto leído, porque Content-Length puede faltar o mentir.
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Mensaje demasiado largo" }, { status: 413 });
  }
  const texto = await request.text();
  if (new TextEncoder().encode(texto).length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Mensaje demasiado largo" }, { status: 413 });
  }
  const body = (() => {
    try {
      return JSON.parse(texto);
    } catch {
      return null;
    }
  })();
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { nombre, area, urgencia, resumen, empresa } = parsed.data;

  // Bot: respondemos OK para no darle pistas, pero no registramos nada.
  if (empresa) return NextResponse.json({ ok: true });

  // El área tiene que existir y su nombre lo pone el servidor: lo que mande el navegador no vale.
  const areaEncontrada = (await getAreas()).find((a) => a.slug === area);
  if (!areaEncontrada) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const areaNombre = areaEncontrada.nombre;

  const resultados = await Promise.allSettled([
    guardarEnSanity({ nombre, area, areaNombre, urgencia, resumen }),
    enviarEmail({ nombre, areaNombre, urgencia, resumen }),
  ]);

  // Solo el mensaje del error: nunca el objeto completo, para no copiar datos personales a los logs.
  resultados.forEach((r) => {
    if (r.status === "rejected") console.error("Error registrando lead:", r.reason instanceof Error ? r.reason.message : "desconocido");
  });
  if (resultados.every((r) => r.status === "rejected" || r.value === false)) {
    console.error("Consulta recibida pero sin entregar: ni guardada ni enviada por correo (revisar variables)");
  }

  // La respuesta no revela qué está configurado (Resend, Sanity): solo que se recibió.
  return NextResponse.json({ ok: true });
}

async function guardarEnSanity(lead: {
  nombre: string;
  area: string;
  areaNombre?: string;
  urgencia?: string;
  resumen: string;
}): Promise<boolean> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_API_TOKEN;
  // Los datos personales NUNCA van al dataset del contenido (es público: lo lee
  // el sitio). Solo se guardan si hay un dataset privado dedicado a consultas.
  const dataset = process.env.SANITY_LEADS_DATASET;
  if (!projectId || !token || !dataset) return false;

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });
  await client.create({
    _type: "lead",
    ...lead,
    estado: "nuevo",
    recibido: new Date().toISOString(),
    consentimientoEn: new Date().toISOString(),
  });
  return true;
}

async function enviarEmail(lead: {
  nombre: string;
  areaNombre: string;
  urgencia?: string;
  resumen: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY no configurada; lead no enviado por email");
    return false;
  }
  const datos = await getDatosDelEstudio();
  const resend = new Resend(apiKey);
  const urgente = lead.urgencia === "inmediata";
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? "Consultas web <onboarding@resend.dev>",
    to: process.env.LEADS_EMAIL ?? datos.email,
    subject: `${urgente ? "URGENTE · " : ""}Nueva consulta — ${lead.areaNombre} — ${lead.nombre}`,
    text: `Nombre: ${lead.nombre}\nÁrea: ${lead.areaNombre}\nUrgencia: ${lead.urgencia ?? "-"}\n\n${lead.resumen}`,
    html: `<p><strong>Nombre:</strong> ${escapar(lead.nombre)}<br><strong>Área:</strong> ${escapar(lead.areaNombre)}<br><strong>Urgencia:</strong> ${escapar(lead.urgencia ?? "-")}</p><p>${escapar(lead.resumen).replace(/\n/g, "<br>")}</p>`,
  });
  if (error) throw new Error(error.message);
  return true;
}
