# Despliegue en Vercel (principal) y Render (respaldo)

> Estado verificado el 02/11/2026: `npm ci`, `npx tsc --noEmit`, `npm run lint` y `npm run build` terminan con código 0, tanto **sin variables de entorno** como con las del ejemplo. Sin Sanity configurado el sitio usa el contenido de respaldo de `src/lib/content.ts`.

## 1. Rama de producción

El repo no tiene `main`. La rama por defecto en GitHub (`claude/estudios-juridicos-web-be8i58`) está atrasada respecto del diseño actual.

**Propuesta:** crear `main` a partir de `integracion` (= `rediseno-premium` + `chore/seguridad-ci`) y marcarla como rama por defecto.

```bash
git checkout integracion
git branch main
git push -u origin main
```

Después, en GitHub → Settings → Branches, cambiar la rama por defecto a `main`. El CI (`.github/workflows/ci.yml`) ya corre en `push` a `main`.

## 2. Variables de entorno

Se cargan en Vercel → Project → Settings → Environment Variables (entorno *Production*). Ninguna es obligatoria para que el build pase.

| Variable | Para qué | Sin ella |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública (sitemap, robots, JSON-LD, Open Graph) | Usa el dominio de ejemplo: **cargarla antes de publicar** |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Conecta el panel de contenido | Se muestra el contenido de respaldo |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset de contenido (`production`) | Usa `production` |
| `SANITY_API_TOKEN` | Escritura de consultas en Sanity | Las consultas no se guardan |
| `SANITY_LEADS_DATASET` | Dataset **privado** para consultas (`consultas`) | Las consultas llegan solo por email |
| `ADMIN_USER` | Usuario de la primera barrera de `/studio` | Usa `admin` |
| `ADMIN_PASSWORD` | Contraseña de `/studio` | **`/studio` responde 404 en producción** (falla cerrado) |
| `RESEND_API_KEY` | Envío de email del formulario | No se envía email |
| `RESEND_FROM` | Remitente (dominio verificado en Resend) | `onboarding@resend.dev`, que solo entrega al dueño de la cuenta de Resend: **verificar el dominio antes de entregar** |
| `LEADS_EMAIL` | Destinatario de las consultas | Email del estudio |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número real, con código de país, sin `+` ni espacios | Número de ejemplo `5491100000000` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 | Sin GA4 |

Orden sugerido: Sanity y `ADMIN_*` primero; Resend y WhatsApp al final.

## 3. Crear el proyecto en Vercel

1. Vercel → *Add New → Project* → importar `joaquinyunes/estudio-juridico`.
2. *Production Branch*: `main`.
3. Framework: Next.js (se detecta solo). Build `npm run build`, install `npm ci`. Node 22.
4. Cargar las variables de la tabla y desplegar.
5. En el panel de Sanity (manage.sanity.io → API → CORS origins) agregar la URL del sitio con *credentials*.
6. Para dominio propio: Settings → Domains, y actualizar `NEXT_PUBLIC_SITE_URL`.

## 4. Render como respaldo

El plan gratis se duerme y el primer pedido tarda ~53 s: no sirve para un producto vendido. Si se mantiene Render, debe ser un plan de pago que no se duerma (Starter o superior).

- Rama: `main`. Build `npm ci && npm run build`. Start `npm run start`.
- Mismas variables que en Vercel. Health check: `/`.
- Mientras Vercel sea el principal, el dominio apunta a Vercel; Render queda en su URL `onrender.com`.

## 5. Verificación después de desplegar

- [ ] `/` y `/contacto` responden 200 en menos de 3 s.
- [ ] `/studio` pide usuario y contraseña (401 sin credenciales); sin `ADMIN_PASSWORD` responde 404.
- [ ] Enviar una consulta de prueba: llega el email y, si hay dataset `consultas`, queda guardada.
- [ ] `/sitemap.xml` y `/robots.txt` muestran la URL real.
- [ ] Consola del navegador sin avisos de CSP (ver abajo).
- [ ] El botón de WhatsApp abre el número del estudio.

## 6. CSP en modo «solo reporte»

`next.config.ts` envía `Content-Security-Policy-Report-Only` con `'unsafe-inline'` en scripts (Next.js lo necesita hasta pasar a nonces). Solo `frame-ancestors` se aplica. Revisar la consola con la URL real y, si no hay avisos, cambiar la clave a `Content-Security-Policy`. Si se activa GA4 o se embebe otro servicio, agregar su dominio a la política.

## 7. Lo que no se pudo verificar sin cuentas reales

Sitio con las claves reales de Sanity y Resend; envío real de email; el panel `/studio` con login; tiempos de respuesta en Vercel.
