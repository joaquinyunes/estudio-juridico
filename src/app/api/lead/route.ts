import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createClient } from "@sanity/client";
import { getDatosDelEstudio } from "@/lib/cms";

const leadSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  area: z.string().min(1).max(60),
  areaNombre: z.string().max(120).optional(),
  urgencia: z.enum(["inmediata", "mes", "informacion"]).optional(),
  resumen: z.string().trim().min(20).max(1500),
  // Consentimiento (Ley 25.326): se exige también acá, no solo en el navegador.
  acepta: z.literal(true),
  empresa: z.string().optional(), // honeypot
});

// Límite simple por IP (por instancia). Suficiente para frenar abuso básico;
// para tráfico alto conviene mover esto a Vercel KV / Upstash.
const VENTANA_MS = 10 * 60 * 1000;
const MAX_POR_VENTANA = 5;
const intentos = new Map<string, number[]>();

function limitado(ip: string): boolean {
  const ahora = Date.now();
  const recientes = (intentos.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  recientes.push(ahora);
  intentos.set(ip, recientes);
  // Evita que el mapa crezca sin límite con IPs que no vuelven.
  if (intentos.size > 5000) {
    for (const [k, v] of intentos) if (ahora - v[v.length - 1] >= VENTANA_MS) intentos.delete(k);
  }
  return recientes.length > MAX_POR_VENTANA;
}

const MAX_BODY_BYTES = 8 * 1024;

const escapar = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (limitado(ip)) {
    return NextResponse.json({ error: "Demasiados envíos, probá en unos minutos" }, { status: 429 });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Formato no soportado" }, { status: 415 });
  }
  // El tope se aplica al texto leído (no solo a Content-Length, que puede mentir).
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

  const { nombre, area, areaNombre, urgencia, resumen, empresa } = parsed.data;

  // Bot: respondemos OK para no darle pistas, pero no registramos nada.
  if (empresa) return NextResponse.json({ ok: true });

  const resultados = await Promise.allSettled([
    guardarEnSanity({ nombre, area, areaNombre, urgencia, resumen }),
    enviarEmail({ nombre, areaNombre: areaNombre ?? area, urgencia, resumen }),
  ]);

  resultados.forEach((r) => {
    if (r.status === "rejected") console.error("Error registrando lead", r.reason);
  });

  return NextResponse.json({
    ok: true,
    guardado: resultados[0].status === "fulfilled" && resultados[0].value,
    emailEnviado: resultados[1].status === "fulfilled" && resultados[1].value,
  });
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
