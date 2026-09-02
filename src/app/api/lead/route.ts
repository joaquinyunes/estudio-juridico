import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { datosDelEstudio } from "@/lib/content";

const leadSchema = z.object({
  nombre: z.string().min(2),
  area: z.string().min(1),
  resumen: z.string().min(20),
  areaNombre: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { nombre, area, resumen, areaNombre } = parsed.data;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    // Sin RESEND_API_KEY configurada, el lead no se pierde: el formulario ya
    // deriva a WhatsApp de todas formas. Ver PROGRESS.md — pendiente conectar
    // credenciales reales de Resend.
    console.warn("RESEND_API_KEY no configurada; lead no enviado por email", {
      nombre,
      area,
    });
    return NextResponse.json({ ok: true, emailEnviado: false });
  }

  try {
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: "Estudio Jurídico <onboarding@resend.dev>",
      to: datosDelEstudio.email,
      subject: `Nueva consulta — ${areaNombre ?? area}`,
      text: `Nombre: ${nombre}\nÁrea: ${areaNombre ?? area}\nResumen: ${resumen}`,
    });
    return NextResponse.json({ ok: true, emailEnviado: true });
  } catch (err) {
    console.error("Error enviando email de lead", err);
    return NextResponse.json({ ok: true, emailEnviado: false });
  }
}
