> Archivo vivo: qué se hizo y qué falta en este proyecto. Misma base que `soluciones-repos/ESTADO-PROYECTOS/estudio-juridico.md` (31/10/2026). Cada sesión lo actualiza al terminar.

# estudio-juridico (sitio de captación, Next.js + Sanity) — rama `rediseno-premium` · `aea86dc`

## Hecho
- Rediseño premium, panel de avisos y acceso restringido al panel. Docs de diseño y guía del panel. Es un **producto vendido**.
- 02/11: rama `integracion` = `rediseno-premium` + `chore/seguridad-ci` (encabezados, CSP en solo reporte, CI). `npm ci`, `tsc`, `lint` y `build` verdes con variables vacías y con las del ejemplo.
- 02/11 WP-12: `docs/DEPLOY-VERCEL.md` (rama `main` propuesta, tabla de variables, Vercel, Render, checklist). Diseño/accesibilidad: axe-core sin violaciones en 14 páginas tras corregir 4 (landmarks, orden de encabezados, `aside` anidado, 404 sin `main`).

## Falta (código)
- Nada bloqueante. **WP-35 (opcional/upsell):** CRM liviano de consultas; preguntar antes si el cliente lo quiere.
- No verificado: sitio con claves reales de Sanity/Resend, lector de pantalla, dispositivos reales, que la CSP en solo reporte no avise con la URL real.

## Te toca a vos
1. Crear `main` desde `integracion`, hacerla rama por defecto y hacer push (pasos en `docs/DEPLOY-VERCEL.md`).
2. Crear el proyecto en **Vercel** y cargar las variables (tabla en el doc). Sanity y `ADMIN_*` primero; Resend y WhatsApp al final. Verificar el dominio en Resend antes de entregar.
3. Render como respaldo con plan que no se duerma (gratis tarda ~53 s en frío).

## Plataformas hoy
Render `estudio-juridico` (web gratis, rama `rediseno-premium`). No tiene Vercel.
