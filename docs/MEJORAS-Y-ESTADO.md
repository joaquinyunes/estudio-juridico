> Archivo vivo: qué se hizo y qué falta en este proyecto. Misma base que `soluciones-repos/ESTADO-PROYECTOS/estudio-juridico.md` (31/10/2026). Cada sesión lo actualiza al terminar.

# estudio-juridico (sitio de captación, Next.js + Sanity) — rama `rediseno-premium` · `aea86dc`

## Hecho
- Rediseño premium, panel de avisos y acceso restringido al panel. Docs de diseño y guía del panel. Es un **producto vendido**. Árbol limpio, sin cambios de código en esta ronda.

## Falta (código)
- **WP-12:** el repo **no tiene `main`**: la rama por defecto (`claude/estudios-juridicos-web-be8i58`, `c11cff2`) está 3 commits detrás de `rediseno-premium`. Proponer rama de producción, verificar `npm run build` con variables vacías y con las del ejemplo, dejar `docs/DEPLOY-VERCEL.md`.
- Sin CSP (WP-43).
- **WP-35 (opcional/upsell):** CRM liviano de consultas, agenda de vencimientos. Preguntar antes si el cliente lo quiere.

## Te toca a vos
1. Decidir la rama de producción y fusionar `rediseno-premium` en ella (el servicio de Render ya despliega desde `rediseno-premium`).
2. Crear el proyecto en **Vercel** (detecta Next solo) y cargar: Sanity, `ADMIN_USER`/`ADMIN_PASSWORD`, Resend, WhatsApp, `NEXT_PUBLIC_SITE_URL`.
3. **Arranque en frío de 53 s en Render gratis** (inaceptable para un producto vendido): con la regla del dueño, Vercel como principal y Render como respaldo con plan que no se duerma.

## Plataformas hoy
Render `estudio-juridico` (web gratis, rama `rediseno-premium`). No tiene Vercel.
