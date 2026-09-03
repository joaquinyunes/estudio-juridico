# Estado del proyecto — actualizar en cada sesión

> Regla: antes de terminar una sesión de trabajo, actualizar este archivo con qué se hizo y qué sigue. La próxima sesión debe poder arrancar leyendo solo este archivo + `docs/manual-desarrollo.md`.

Referencia del plan completo: [`docs/manual-desarrollo.md`](docs/manual-desarrollo.md).

## Última actualización

2026-09-03 — Sesión: paleta "confianza" aplicada al diseño, wiring de GA4 y contenido demo de `/equipo` (Fase 3 del manual, en curso). Confirmado con el usuario: sigue como template genérico (sin cliente real todavía) y sin cuentas de Sanity/Resend creadas.

## Hecho

- [x] Manual de producto y desarrollo (`docs/manual-desarrollo.md`) — propuesta, stack, fases, handoff.
- [x] Proyecto Next.js 16 (App Router) + TypeScript + Tailwind CSS scaffolded en la raíz del repo.
- [x] Dependencias instaladas: `react-hook-form`, `zod`, `@hookform/resolvers`, `sanity`, `@sanity/client`, `@sanity/image-url`, `next-sanity`, `resend`. (`next-seo` y `next-sitemap` se instalaron y luego se sacaron — se usa la Metadata API nativa de Next.js, ver nota en `docs/manual-desarrollo.md` §3).
- [x] shadcn/ui **no** se pudo instalar (CLI bloqueada por política de red del entorno de scaffolding — ver nota en el manual). Componentes de UI escritos a mano en Tailwind.
- [x] Estructura de carpetas completa (§8.5 del manual): `src/app/{areas/[slug],equipo,testimonios,preguntas-frecuentes,contacto,legales/aviso-legal,api/lead,studio}`, `src/components/`, `src/lib/`, `sanity/schemas/`.
- [x] Esquemas de Sanity: `areaDePractica`, `testimonio`, `datosDelEstudio` (`sanity/schemas/`), más `sanity.config.ts` y el panel embebido en `/studio`.
- [x] Contenido de **demostración** (placeholder, no real) en `src/lib/content.ts`: 5 áreas de práctica (laboral, familia, penal, comercial, sucesiones), cada una con bullets, FAQ y testimonios anonimizados de ejemplo.
- [x] Todas las páginas del mapa del sitio (§4 del manual) construidas y renderizando: Home, `/areas/[slug]` (con `generateStaticParams`, metadata y JSON-LD `LegalService`+`FAQPage`+`BreadcrumbList` por página), `/equipo`, `/testimonios`, `/preguntas-frecuentes`, `/contacto`, `/legales/aviso-legal`.
- [x] `FormularioCalificador` (react-hook-form + zod): pide nombre, área y resumen; al enviar arma el deep link de WhatsApp con el mensaje prellenado y solo entonces muestra el botón de WhatsApp (bloquea el acceso directo, tal como pide el manual).
- [x] API route `/api/lead`: valida con zod, intenta enviar email por Resend si `RESEND_API_KEY` está configurada; si no, no rompe el flujo (el usuario igual llega a WhatsApp).
- [x] `src/app/sitemap.ts` y `src/app/robots.ts` (nativos de Next, generan `/sitemap.xml` y `/robots.txt` reales).
- [x] `.env.local.example` con todas las variables necesarias documentadas.
- [x] Verificado localmente: `npm run build` compila sin errores (17 rutas generadas, incluidas las 5 landings por área), `npx eslint .` sin errores, y `npm run start` sirviendo Home + `/areas/laboral` + sitemap + robots con status 200 y JSON-LD presente.
- [x] **Diseño visual — paleta "confianza" aplicada de verdad** (antes solo estaba definida como tokens sin usar): tokens `--color-navy`, `--color-navy-light`, `--color-gold`, `--color-gold-light` movidos a un bloque `@theme` en `globals.css` para que generen utilidades reales de Tailwind (`bg-navy`, `text-gold`, etc). Header y footer ahora en navy con hover/acentos dorados; hero de Home en navy con línea decorativa dorada y CTA primario dorado; cards de áreas con borde dorado al hover; checks de bullets, indicador +/− del FAQAccordion y borde izquierdo de TestimonioCard en dorado; botón y focus ring del FormularioCalificador en navy/dorado; headings de todas las páginas unificados a `text-navy`. El CTA de WhatsApp se dejó en verde (color de marca de WhatsApp) a propósito. Verificado con `npm run build` + `npm run start` + capturas de pantalla (Home y `/areas/laboral`).
- [x] **GA4 wiring**: `layout.tsx` ahora inyecta el script de `gtag.js` (vía `next/script`, `strategy="afterInteractive"`) solo si `NEXT_PUBLIC_GA_ID` está seteada — con la env var vacía no cambia nada (sigue sin cargar ningún script). Antes el código de `WhatsAppCTA` y `FormularioCalificador` ya llamaba a `window.gtag(...)` pero el script nunca se cargaba, así que esos eventos nunca se enviaban a ningún lado. Falta que el usuario cree la propiedad GA4 y complete el ID real en `.env.local`; verificado localmente con un ID de prueba (`NEXT_PUBLIC_GA_ID=G-TEST123`) que el script se inyecta correctamente y que sin la var no aparece.
- [x] **Contenido demo de `/equipo`**: se agregó `equipo` (array de `MiembroDelEquipo`) a `src/lib/content.ts` con 3 integrantes de ejemplo (nombre, cargo, matrícula placeholder, especialidades, bio) y un componente `MiembroEquipoCard` con avatar de iniciales (navy + dorado, sin depender de fotos reales). Reemplaza el texto "contenido pendiente" que tenía la página antes. Sigue siendo contenido de demostración explícito (los nombres y matrículas son placeholder), consistente con la decisión de seguir como template genérico.

## Qué falta por hacer (orden sugerido para la próxima sesión)

1. **Conectar Sanity de verdad**: el usuario confirmó que todavía no tiene cuenta — crear proyecto en sanity.io (`npx sanity login` + `npx sanity init` requieren sesión interactiva del usuario, no se puede automatizar sin credenciales), cargar `NEXT_PUBLIC_SANITY_PROJECT_ID` en `.env.local`, y migrar las páginas de leer `src/lib/content.ts` a hacer queries GROQ contra `src/lib/sanity.ts` (los esquemas y el cliente ya están armados, falta el "wiring" final).
2. **Completar el `NEXT_PUBLIC_GA_ID` real**: el wiring de GA4 ya está (ver arriba), solo falta que el usuario cree la propiedad en Google Analytics y cargue el ID en `.env.local`.
3. **Imágenes reales**: hoy `/equipo` usa avatares de iniciales (sin depender de fotos) y el resto del sitio no tiene imágenes. Si en algún momento se consigue un cliente real, falta definir de dónde salen las fotos (stock con licencia, fotos reales) e integrarlas con `next/image`.
4. **Google Business Profile / Search Console**: checklist de configuración pendiente (fuera del código, es un paso operativo de la Fase 5 del manual).
5. **Deploy en Vercel**: pendiente conectar el repo a una cuenta de Vercel del usuario (no se puede automatizar sin acceso a esa cuenta).
6. **WhatsApp Cloud API / n8n (upsell avanzado)**: no se empezó — es explícitamente fuera del paquete base de USD 1000 (ver manual §7), solo se implementa si un cliente lo paga aparte.
7. **Portal de seguimiento de expediente**: no se empezó — proyecto aparte según el manual, no forma parte de este template.
8. **Si aparece un cliente/estudio real**: reemplazar el contenido de `src/lib/content.ts` (áreas, testimonios, equipo, datos del estudio) y el número de WhatsApp placeholder (`5491100000000`) por los datos reales.

## Decisiones ya confirmadas por el usuario (2026-09-03)

- Sigue como template genérico con contenido placeholder — todavía no hay cliente/estudio real.
- No tiene cuenta de Sanity.io ni de Resend creadas todavía.

## Decisiones pendientes que necesitan al usuario (no asumir)

- Cuando haya un cliente real: nombre, áreas, equipo real y número de WhatsApp real para reemplazar el contenido demo.
- ¿Deploy en Vercel bajo qué cuenta?

## Cómo retomar

```bash
cd /home/user/estudio-juridico   # o donde esté clonado el repo
cat PROGRESS.md                  # este archivo
cat docs/manual-desarrollo.md    # plan completo
git log --oneline                # ver qué se commiteó
npm install
npm run dev                      # http://localhost:3000
```
