# Estado del proyecto — actualizar en cada sesión

> Regla: antes de terminar una sesión de trabajo, actualizar este archivo con qué se hizo y qué sigue. La próxima sesión debe poder arrancar leyendo solo este archivo + `docs/manual-desarrollo.md`.

Referencia del plan completo: [`docs/manual-desarrollo.md`](docs/manual-desarrollo.md).

## Última actualización

2026-09-29 — Sesión: rediseño completo nivel premium ("Folio"), contenido de demo completo, calculadora de indemnización, Sanity conectado con respaldo local, auditoría Lighthouse.

## Hecho

### Sesión 2026-09-29 — rediseño premium

- [x] **Análisis de competencia** (`docs/analisis-competencia.md`): estudios grandes (Marval, Bruchou…) vs. estudios de nicho de CABA (Chaiman, Arabia…). Conclusión y posicionamiento documentados.
- [x] **Sistema de diseño "Folio"** (`docs/sistema-de-diseno.md`): papel/tinta/lacre, Fraunces + Geist + Geist Mono, arcos neoclásicos, fotos en monocromo cálido, numeración "§", sello animado, expedientes. Tokens en `src/app/globals.css`.
- [x] **Estudio de demo "Iturbe & Lavalle"** (ficticio, desde 1987) con contenido completo en `src/lib/content.ts`: 5 áreas (titular, descripción, qué resolvemos, pasos, FAQs), 7 abogados con bio y matrícula, historia en 6 hitos, 6 testimonios-expediente, 3 notas, FAQs generales. `modoDemo: true` muestra un aviso de "estudio ficticio" en el pie.
- [x] **Imágenes**: 21 fotos de Unsplash (licencia libre, créditos en `docs/creditos-imagenes.md`) servidas con `next/image` (AVIF/WebP).
- [x] **Home**: portada, cifras, marquesina, estudio + principios, índice de áreas con foto que sigue al cursor, calculadora, método, casos, historia deslizable, equipo, notas, FAQ, contacto.
- [x] **Calculadora de indemnización** (`src/lib/indemnizacion.ts` + `CalculadoraDespido`): LCT con reformas 27.742 y 27.802 (período de prueba 6 meses, base sin SAC/vacaciones, preaviso, integración, SAC y vacaciones proporcionales). Casos borde verificados. Página propia `/calculadora-indemnizacion` (keyword SEO de alto volumen).
- [x] **Formulario calificador rediseñado**: área (chips), urgencia, nombre, resumen con contador, consentimiento Ley 25.326, honeypot. Validación nativa de react-hook-form en el cliente (se sacó Zod del bundle, −98 KB); `/api/lead` valida con Zod, limita envíos por IP, guarda el lead en Sanity (si hay token) y envía email con Resend (si hay clave).
- [x] **Páginas nuevas**: `/notas`, `/notas/[slug]`, `/calculadora-indemnizacion`, `/legales/privacidad`, 404 propia, `opengraph-image`, `icon.svg`. `/equipo` ya no es placeholder.
- [x] **Menú mobile** (antes no había navegación en celular) + barra fija inferior con CTA en mobile.
- [x] **Sanity conectado**: `src/lib/cms.ts` lee del panel si hay `NEXT_PUBLIC_SANITY_PROJECT_ID` y cae al contenido local si no hay proyecto o está vacío. Esquemas nuevos: `abogado`, `nota`, `lead` (bandeja de consultas con estado); `areaDePractica` y `testimonio` ampliados.
- [x] **Route group `(sitio)`**: el panel `/studio` ya no queda envuelto en el header/footer del sitio.
- [x] **Analytics**: GA4 se inyecta si hay `NEXT_PUBLIC_GA_ID` (eventos `form_submit_por_area`, `whatsapp_click`, `calculadora_uso`); Vercel Analytics se activa solo en Vercel.
- [x] **SEO técnico**: `metadataBase`, canonical por página, Open Graph, JSON-LD `LegalService` (estudio y por área), `FAQPage`, `BreadcrumbList`, `Person` (equipo), `Article` (notas), `WebApplication` (calculadora). Sitemap con notas y prioridades.
- [x] **Seguridad**: headers (HSTS, nosniff, frame-options, referrer, permissions) en `next.config.ts`; JSON-LD escapado; email HTML escapado.
- [x] **Mapa** de contacto con carga al hacer clic (sin 450 KB de Google ni cookies hasta que el usuario lo pide).
- [x] **Verificado**: `npm run build` OK (24 rutas), `npx eslint .` sin errores, flujo completo del formulario probado con Playwright (validación → `/api/lead` 200 → link de WhatsApp con mensaje correcto), calculadora probada, mobile 390 px sin scroll horizontal.
- [x] **Lighthouse mobile** (build de producción, local): Accesibilidad 100, Buenas prácticas 100 y SEO 100 en todas las páginas medidas. Performance: calculadora, testimonios y FAQ 92, landings de área 90, contacto 89, equipo 88, home 83–86 (LCP observado real 1,5 s; el simulado de 4,2 s viene del peso total de la home).

### Sesión 2026-09-02 — scaffolding

- [x] Manual de producto (`docs/manual-desarrollo.md`), Next.js 16 + TypeScript + Tailwind, esquemas base de Sanity, páginas del mapa del sitio, formulario calificador, `/api/lead`, sitemap y robots.

## Qué falta por hacer (orden sugerido)

1. **Contenido real del cliente**: reemplazar `src/lib/content.ts` (o cargarlo en Sanity) con datos, fotos del equipo, testimonios autorizados y cifras reales. Poner `modoDemo: false`.
2. **Sanity**: crear el proyecto (`npx sanity login` + `npx sanity init` requieren sesión interactiva), completar `NEXT_PUBLIC_SANITY_PROJECT_ID` y `SANITY_API_TOKEN` (con permiso de escritura para guardar leads) y cargar el contenido. Las páginas ya leen del panel.
3. **Resend**: verificar dominio, completar `RESEND_API_KEY`, `RESEND_FROM` y `LEADS_EMAIL`.
4. **Variables**: `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_SITE_URL` con los valores reales.
5. **Deploy en Vercel** bajo la cuenta que se defina y conectar dominio.
6. **Performance de la home**: si se exige ≥ 90 también en la home, las palancas que quedan son cargar el formulario de contacto de forma diferida y reducir la cantidad de secciones o imágenes de la home.
7. **Revisión legal** de aviso legal y política de privacidad por el estudio antes de publicar.
8. Google Business Profile / Search Console (paso operativo, Fase 5 del manual).
9. Upsells fuera del paquete: WhatsApp Cloud API / n8n, portal de expedientes.

## Decisiones tomadas en esta sesión (revisables)

- Se siguió como **template de demo** con un estudio ficticio, pensado para mostrar a prospectos.
- Se eligió una identidad visual propia en lugar del navy + dorado que proponía el manual: es el principal diferenciador frente a la competencia.
- El WhatsApp directo solo se ofrece para la **guardia penal** (urgencias); el resto de las consultas pasa por el formulario calificador, como pide el manual.

## Cómo retomar

```bash
cat PROGRESS.md                  # este archivo
cat docs/manual-desarrollo.md    # plan completo
npm install
npm run dev                      # http://localhost:3000
```
