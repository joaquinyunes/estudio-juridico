# Estudio Jurídico — Sistema de Captación Web

Producto: sitio web para estudios jurídicos vendido como **sistema de captación y filtrado de clientes**, no como página institucional. Ticket cerrado: **USD 1000**.

El manual completo (propuesta comercial, stack técnico, fases del proyecto, guía de arranque y checklist de handoff) está en:

👉 [`docs/manual-desarrollo.md`](docs/manual-desarrollo.md)

El estado actual del desarrollo (qué está hecho y qué falta) está en:

👉 [`PROGRESS.md`](PROGRESS.md)

## Documentación

- [`docs/analisis-competencia.md`](docs/analisis-competencia.md) — relevamiento de competencia y posicionamiento.
- [`docs/sistema-de-diseno.md`](docs/sistema-de-diseno.md) — sistema visual "Folio" (tokens, tipografía, componentes).
- [`docs/creditos-imagenes.md`](docs/creditos-imagenes.md) — origen y licencia de las fotos.

## Resumen rápido

- **Stack:** Next.js 16 (App Router) + TypeScript + Tailwind 4, CMS headless en Sanity.io (con contenido de respaldo local), formularios con react-hook-form (validación en servidor con zod), hosting en Vercel.
- **Demo:** estudio ficticio "Iturbe & Lavalle" con contenido, equipo, historia, casos y notas completos, más una calculadora de indemnización actualizada a la Ley 27.802.
- **Diferenciador central:** landing propia por especialidad (no una página de "servicios"), formulario calificador antes de mostrar WhatsApp, SEO técnico real (schema.org, Core Web Vitals), y panel de autoadministración para que el estudio edite contenido sin depender del desarrollador.
- **Fases:** Descubrimiento → Contenido → Diseño → Desarrollo → QA → Lanzamiento → Handoff → Mantenimiento (recurrente, upsell).

## Desarrollo local

```bash
npm install
cp .env.local.example .env.local   # completar con las claves reales
npm run dev
```

Ver el detalle completo, con checklists y comandos de arranque, en `docs/manual-desarrollo.md`.
