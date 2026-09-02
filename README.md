# Estudio Jurídico — Sistema de Captación Web

Producto: sitio web para estudios jurídicos vendido como **sistema de captación y filtrado de clientes**, no como página institucional. Ticket cerrado: **USD 1000**.

El manual completo (propuesta comercial, stack técnico, fases del proyecto, guía de arranque y checklist de handoff) está en:

👉 [`docs/manual-desarrollo.md`](docs/manual-desarrollo.md)

## Resumen rápido

- **Stack:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, CMS headless en Sanity.io, formularios con react-hook-form + zod, hosting en Vercel.
- **Diferenciador central:** landing propia por especialidad (no una página de "servicios"), formulario calificador antes de mostrar WhatsApp, SEO técnico real (schema.org, Core Web Vitals), y panel de autoadministración para que el estudio edite contenido sin depender del desarrollador.
- **Fases:** Descubrimiento → Contenido → Diseño → Desarrollo → QA → Lanzamiento → Handoff → Mantenimiento (recurrente, upsell).

Ver el detalle completo, con checklists y comandos de arranque, en `docs/manual-desarrollo.md`.
