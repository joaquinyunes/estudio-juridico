# Pendientes del usuario — Estudio jurídico (20/11/2026)

Todo lo que se podía hacer sin cuentas externas ni textos legales ya está hecho y verificado (ver `PLAN-VENTA-10K.md`). Lo que sigue necesita **tu cuenta, tu decisión o a un profesional**. Ordenado por urgencia.

## 1. Antes o justo después de que se despliegue `main` (5 min)

- [ ] **`ADMIN_PASSWORD` en Vercel con 12 caracteres o más.** Si es más corta, `/studio` responde 404 (falla cerrado) desde este despliegue. Cambiarla y redeployar.
- [ ] **Abrir el sitio con la consola del navegador** (F12) en inicio, contacto y un área: no debe haber mensajes «Content Security Policy». La CSP ahora **bloquea**; si algo legítimo se bloquea (GA4, un mapa), pasame el mensaje o agregá el dominio en `next.config.ts`.
- [ ] Probar `https://tu-sitio/studio`: debe pedir usuario y clave (401 sin ellas).

## 2. Claves y cuentas (yo no las toco)

| Qué | Dónde | Para qué |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, dataset, `SANITY_API_TOKEN` (escritura), `SANITY_LEADS_DATASET=consultas` (privado) | sanity.io/manage → Vercel → redeploy | Panel de contenido y guardar consultas |
| `RESEND_API_KEY`, `RESEND_FROM` (dominio verificado), `LEADS_EMAIL` | resend.com → Vercel | Que la consulta llegue por correo |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` (real, con código de país, sin `+`) | Vercel | Botón de WhatsApp |
| `NEXT_PUBLIC_SITE_URL` (dominio real) y `NEXT_PUBLIC_GA_ID` | Vercel | Sitemap, SEO, analítica |
| `NEXT_PUBLIC_MODO_DEMO=0` | Vercel, **solo en el sitio real del estudio** | Oculta el aviso «estudio ficticio» |
| `ADMIN_TOTP_SECRET` | `node scripts/generar-totp.mjs` → Vercel y tu app autenticadora | 2FA del panel (ver `docs/SEGURIDAD.md`) |

## 3. Seguridad que depende de vos

- [ ] **Decidir si el repositorio de GitHub pasa a privado.** Hoy es **público** y contiene el plan de venta, el veredicto del tribunal y los documentos comerciales. No hay claves en el repo (revisado), pero la estrategia y el precio quedan a la vista. Además, el backup de consultas **solo se exporta si el repo es privado**.
- [ ] **Backup de Sanity:** crear un token de **solo lectura** y cargarlo en GitHub → Settings → Secrets → Actions como `SANITY_API_TOKEN`, y la variable `SANITY_PROJECT_ID`. Después, **probar la restauración** en un dataset de prueba (pasos en `docs/SEGURIDAD.md`) y anotar fecha y resultado ahí.
- [ ] **Roles en Sanity** (manage.sanity.io → Members): invitar solo a quienes editen; Editor para el estudio, Administrador solo para vos.
- [ ] **`public/.well-known/security.txt`:** poner el correo real de contacto y renovar `Expires` (hoy `2027-11-05` y un correo de ejemplo).
- [ ] **Vercel Auth:** decidir si se quita (¿el sitio es público o con login?). Un sitio de estudio debería ser público.
- [ ] Activar en tu cuenta de GitHub las **notificaciones de Actions por correo** (para enterarte si cae el sitio: `uptime.yml`, cada 15 min). Si el repo queda 60 días sin actividad, GitHub pausa los workflows programados.
- [ ] Opcional: **Sentry** (DSN) para errores en el servidor; y rate limit compartido (Upstash) si el sitio recibe mucho tráfico.

## 4. Textos legales (con abogado)

- [ ] Revisar la **política de privacidad** (`src/app/(sitio)/legales/privacidad/page.tsx`) y el aviso legal: datos sensibles, proveedores en el exterior (Vercel, Sanity, Resend), plazos de conservación. Es un borrador.
- [ ] Ver si corresponde **inscribir la base de datos** ante la AAIP (Ley 25.326).
- [ ] Términos / contrato de licencia y mantenimiento (V6 del plan común).

## 5. Comercial (V2, V8, V10)

- [ ] **Precio al que se vendió, qué incluyó, plazo y cuota** → completar la sección «👤 completar» de `docs/CASO-DE-EXITO.md` (el tribunal lo pidió como prueba).
- [ ] **Referencia o testimonio del estudio** (con autorización por escrito): el mensaje para pedirlo ya está redactado en el mismo documento.
- [ ] Decidir **dónde se publica** el caso de éxito (un sitio de venta del producto, no el del estudio).

## 6. Infraestructura

- [ ] **Render de respaldo** con un plan que no se duerma (hoy tarda ~53 s en frío) o apagarlo.
- [ ] **Proyecto de Vercel de la demo** (`estudio-juridico-demo`, sin claves, `NEXT_PUBLIC_MODO_DEMO` sin definir): ver `docs/NUEVO-ESTUDIO.md`. El real no se usa para mostrar.
- [ ] Dominio propio a nombre del estudio; actualizar `NEXT_PUBLIC_SITE_URL` y redeployar.
- [ ] Variable de repositorio `SITE_URL` en GitHub si el dominio cambia (la usa el chequeo de disponibilidad).

## 7. Preguntas para el estudio

- [ ] **¿Quieren un CRM liviano de consultas?** (J5 del plan, opcional). Hoy cada consulta se guarda con estado (nuevo → contactado → cliente → descartado) en un dataset privado de Sanity, pero **el panel no lo muestra**: habría que sumar un segundo espacio de trabajo al Studio. Es una decisión suya; no se hizo.

## Qué NO se pudo verificar sin tus cuentas

La lectura desde un Sanity real (campos de marca, tipo `hito`), el envío real de correo y WhatsApp, el login del Studio con 2FA, la restauración de un backup, el tiempo real de armar un estudio nuevo (cuentas, DNS) y el funcionamiento del backup programado.
