# Manual de Producto y Desarrollo — Sitios Web para Estudios Jurídicos

Este documento es la guía única para vender, diseñar y construir el producto. Reemplaza al pitch original: lo convierte en un paquete cerrado de **USD 1000**, con stack definido, fases con entregables y checklist de handoff.

---

## 1. Por qué esto vale USD 1000 (y no es "una página web")

El error del pitch original es venderlo como sitio institucional con features sueltas. Se vende distinto: **como sistema de captación y filtrado de clientes**, no como folleto digital. El estudio no paga por páginas, paga por dejar de atender por teléfono consultas que no van a pagar, y por aparecer en Google cuando alguien busca "abogado laboral despido [ciudad]" en vez de "estudio jurídico [nombre]".

### Encuadre del precio (usar en la llamada de venta)

> "Un solo cliente de un caso laboral o de familia le paga esto en la primera reunión. Esto no es un gasto de marketing, es la máquina que filtra quién le hace perder el tiempo por teléfono y quién realmente tiene un caso."

- Costo de adquisición de 1 cliente por este canal vs. costo de una campaña de Google Ads mal targeteada (sin landing por especialidad, la campaña quema presupuesto).
- El estudio ya paga por PageSpeed/tiempo perdido sin saberlo: llamadas de gente que solo quiere info gratis.

### Paquete único: "Autoridad Digital" — USD 1000

No se ofrecen 3 tiers con el de $1000 escondido en el medio — eso invita a negociar hacia abajo. Se ofrece **un solo paquete cerrado** con todo adentro, y arriba de eso, upsells recurrentes (ver §7). Si el cliente pide "algo más barato", la respuesta es sacar áreas de práctica (de 5 a 3), no sacar funcionalidad.

**Incluye:**

| # | Entregable | Por qué importa |
|---|---|---|
| 1 | Landing propia por especialidad (hasta 5 áreas: laboral, familia, penal, comercial, sucesiones, etc.) | Google indexa intención de búsqueda específica, no una página genérica de "servicios" |
| 2 | Formulario calificador con lógica condicional (área del caso + resumen) antes de mostrar el botón de WhatsApp | Filtra curiosos; el estudio solo atiende a quien ya escribió su problema |
| 3 | Deep link de WhatsApp con mensaje prellenado y segmentado por área/resumen | El abogado abre el chat ya sabiendo de qué se trata, sin ida y vuelta |
| 4 | Testimonios anonimizados por tipo de caso resuelto (sin nombres) | Prueba social ética y admisible para la profesión |
| 5 | FAQ por especialidad con schema `FAQPage` | Responde gratis lo que hoy responden gratis por teléfono, y gana rich snippets en Google |
| 6 | SEO técnico: schema `LegalService`, sitemap, robots, metadata por página | Sin esto, ninguna landing "linda" trae tráfico nuevo |
| 7 | Core Web Vitals reales (Lighthouse mobile ≥ 90) | Medible, mostrable en una captura de pantalla al cliente |
| 8 | Panel de autoadministración (CMS) para editar textos, testimonios, FAQ y horarios sin llamar al desarrollador | Reduce soporte y es argumento de venta frente a agencias que cobran cada cambio |
| 9 | Checklist + configuración inicial de Google Business Profile | Motor real de SEO local, no la landing sola |
| 10 | Analytics con eventos (clics en WhatsApp, envíos de formulario por área) | El estudio ve qué especialidad genera más consultas reales |
| 11 | 1 sesión de capacitación + 30 días de soporte post-lanzamiento incluidos | Ver §6 Handoff |

**No incluido en el paquete base (se cotiza aparte, ver §7):** portal de seguimiento de expediente, automatización avanzada de WhatsApp (recordatorios/respuestas automáticas vía API paga), múltiples zonas geográficas, mantenimiento mensual.

---

## 2. Los seis diferenciadores (reformulados como entregables, no como frases)

| Diferenciador | Cómo se traduce en el paquete de USD 1000 |
|---|---|
| Automatización real de WhatsApp | Base: deep link segmentado (incluido). Avanzado: recordatorios/respuestas automáticas vía WhatsApp Cloud API — **upsell**, no está en el paquete base porque tiene costo mensual de API |
| SEO local con datos estructurados | Schema `LegalService` + `FAQPage`, sitemap, Google Business Profile — **incluido** |
| Panel de autoadministración | CMS headless (ver stack) — **incluido** |
| Integración con software que ya usan | Depende del estudio (turnero, CRM). Se releva en Fase 0 y se cotiza si aplica — **fuera del paquete base** |
| Mantenimiento mensual como ingreso recurrente | Se ofrece en la firma del contrato, no después — **upsell recurrente**, ver §7 |
| Velocidad y Core Web Vitals reales | Next.js + imágenes optimizadas + hosting en Vercel — **incluido**, y se entrega el screenshot de PageSpeed como prueba en el handoff |

---

## 3. Stack tecnológico (decidido, no a discutir por proyecto)

Se fija un stack único para poder reutilizar código entre estudios (multiplica el margen: el segundo cliente sale en la mitad del tiempo).

| Capa | Elección | Motivo |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** con **TypeScript** | Rutas dinámicas por área de práctica desde el CMS, SSG/ISR para velocidad, SEO nativo |
| Estilos / UI | **Tailwind CSS** (componentes propios, ver nota) | Velocidad de armado, consistencia visual, sin licencias |
| Contenido editable | **Sanity.io** (plan gratuito alcanza) | Da el "panel de autoadministración" sin construir un backend propio; Sanity Studio se despliega como panel embebido |
| Formularios | **react-hook-form** + **zod** (validación) | Lógica condicional (mostrar WhatsApp solo tras completar área + resumen) |
| Envío de formulario | Route handler de Next.js → **Resend** (email al estudio) + registro en Sanity como "lead" | Queda un registro de leads sin depender de planillas manuales |
| WhatsApp | Deep link `https://wa.me/<numero>?text=<mensaje codificado>` generado con los datos del formulario | Cero costo, cero API, funciona siempre |
| WhatsApp avanzado (upsell) | **WhatsApp Cloud API** + **n8n** (self-hosted o cloud) | Recordatorios de turnos/audiencias, respuestas automáticas a FAQ |
| SEO | Metadata API nativa de Next.js + JSON-LD manual (`LegalService`, `FAQPage`, `BreadcrumbList`) + `sitemap.ts`/`robots.ts` nativos | Rich snippets y sitemap automático, sin dependencias extra (ver nota) |
| Analíticas | **GA4** + **Vercel Analytics** (eventos custom: `whatsapp_click`, `form_submit_por_area`) | Mostrar al cliente qué área genera más consultas |
| Hosting / CI | **Vercel** (deploy automático por rama, preview por PR) | Cero DevOps, certificado SSL automático, CDN incluido |
| Repositorio | **GitHub**, un repo template reutilizable + una carpeta de contenido por cliente | Permite clonar y personalizar en horas, no semanas |

> **Nota de implementación (actualizado en el scaffolding inicial):**
> - Se usó **Next.js 16** (la versión estable disponible al momento de crear el proyecto), no 14 — el App Router y las convenciones del manual son compatibles.
> - **shadcn/ui no se pudo instalar**: su CLI (`npx shadcn init`) descarga la configuración desde `ui.shadcn.com`, host bloqueado por la política de red del entorno de desarrollo remoto usado para el scaffolding inicial. Se optó por componentes propios en Tailwind puro (botones, formulario, accordion de FAQ). Si se corre `npx shadcn@latest init` desde una máquina con acceso normal a internet, funciona sin cambios — es solo una limitación del entorno donde se hizo el scaffolding, no una decisión de producto.
> - Se usa la **Metadata API nativa de Next.js** (`export const metadata`, `src/app/sitemap.ts`, `src/app/robots.ts`) en vez de `next-seo` y `next-sitemap`: son las herramientas idiomáticas del App Router y evitan dependencias redundantes.
> - El **panel de Sanity Studio** vive embebido en `/studio` (`src/app/studio/[[...tool]]/page.tsx` + `sanity.config.ts` en la raíz) y requiere marcar la página como `"use client"` — sin eso, Turbopack falla al bundlear una dependencia interna de Sanity (`swr`) en el layer de Server Components.

---

## 4. Arquitectura del sitio (mapa de páginas)

```
/                          → Home (propuesta de valor del estudio, no un listado de servicios)
/areas/[slug]              → 1 página por especialidad (laboral, familia, penal...) — SSG desde Sanity
/equipo                    → Perfil del equipo con credenciales
/testimonios               → Casos resueltos anonimizados (o embebido por área)
/preguntas-frecuentes      → FAQ general + FAQ por área embebida en /areas/[slug]
/contacto                  → Formulario calificador → WhatsApp
/legales/aviso-legal       → Disclaimer profesional (obligatorio en estudios jurídicos)
```

Cada `/areas/[slug]` es su propia unidad SEO: `title`, `description`, schema `LegalService` y `FAQPage` propios, no compartidos con el home.

---

## 5. Fases del proyecto (con entregables y duración)

| Fase | Duración | Entregable | Responsable |
|---|---|---|---|
| **0. Descubrimiento y venta** | 3-5 días | Propuesta firmada, anticipo del 50% cobrado, áreas de práctica priorizadas (3-5), testimonios/FAQ reales recolectados | Vendedor/dev |
| **1. Contenido y arquitectura** | 3-5 días | Mapa del sitio cerrado, copy por área redactado y aprobado por el estudio, testimonios anonimizados redactados | Dev + estudio |
| **2. Diseño (alta fidelidad directo en código)** | 4-6 días | Sistema de diseño aplicado (paleta + tipografía "confianza": serif en títulos, sans en cuerpo, tonos azul marino/dorado), 1-2 páginas de referencia aprobadas | Dev |
| **3. Desarrollo** | 6-10 días | Repo clonado del template, CMS con esquemas cargados, páginas dinámicas por área, formulario calificador, deep link de WhatsApp, SEO técnico, panel de administración funcional | Dev |
| **4. QA y optimización** | 2-3 días | Test cross-device, PageSpeed ≥ 90 mobile, revisión de disclaimers legales, accesibilidad básica (contraste, alt text) | Dev |
| **5. Lanzamiento** | 1 día | Dominio conectado, SSL activo, Google Search Console verificado, Google Business Profile conectado | Dev |
| **6. Handoff y capacitación** | 1 sesión (1-2 h) | Accesos entregados, video/documento de uso del panel, saldo del 50% cobrado | Dev |
| **7. Mantenimiento (post-venta)** | Recurrente | Ver §7 | Dev |

Total estimado: **15-25 días hábiles** de trabajo efectivo desde la firma hasta el lanzamiento.

**Regla de cobro:** 50% de anticipo al firmar (Fase 0), 50% contra entrega en el handoff (Fase 6). Nunca se entregan accesos finales antes del pago del saldo.

---

## 6. Handoff — checklist de entrega

Al cerrar el proyecto, el cliente debe recibir (y firmar la recepción de):

- [ ] Acceso al panel de administración (Sanity Studio) con usuario propio
- [ ] Acceso al dominio (o instrucciones si el dominio quedó a nombre del cliente)
- [ ] Acceso a Vercel (o al menos visibilidad, si el repo se mantiene bajo cuenta propia del desarrollador)
- [ ] Acceso a Google Analytics (GA4) y Google Search Console
- [ ] Acceso al Google Business Profile conectado
- [ ] Video corto (Loom, 5-10 min) explicando cómo editar textos, testimonios y FAQ desde el panel
- [ ] Documento de 1 página: "qué incluyen los 30 días de soporte gratis" (bugs de funcionamiento sí, contenido nuevo o rediseño no)
- [ ] Captura de PageSpeed como prueba de performance entregada
- [ ] Propuesta de mantenimiento mensual presentada (no forzada, pero sí ofrecida en este momento, no después)

---

## 7. Upsells y recurrencia (arriba de los USD 1000)

| Upsell | Modelo | Cuándo ofrecerlo |
|---|---|---|
| Mantenimiento mensual (soporte + 1 cambio de contenido/mes) | Recurrente, ~USD 50-80/mes | En el handoff, no antes ni después |
| WhatsApp avanzado (recordatorios de audiencias/turnos, respuestas automáticas) | Setup one-time + costo mensual de API | Si el estudio maneja alto volumen de turnos/audiencias |
| Portal de seguimiento de expediente para el cliente | Proyecto aparte, cotización propia (nivel avanzado) | Solo si el estudio ya tiene un sistema de gestión de expedientes con el que integrar |
| SEO multi-zona (landing por barrio/ciudad si atienden varias sedes) | Por zona adicional | Si el estudio tiene más de una sede o zona de cobertura |
| Área de práctica adicional (más allá de las 5 incluidas) | Por landing adicional | Si el estudio quiere cubrir más especialidades luego del lanzamiento |

---

## 8. Guía técnica para arrancar (manual de inicio)

Pasos concretos para levantar el proyecto la primera vez y para clonarlo en cada cliente nuevo.

### 8.1 Requisitos previos

- Node.js 20+
- Cuenta en Vercel (hosting)
- Cuenta en Sanity.io (CMS)
- Cuenta en Resend (envío de emails del formulario)
- Número de WhatsApp Business del estudio

### 8.2 Scaffolding inicial (una sola vez, para crear el template reutilizable)

```bash
npx create-next-app@latest estudio-juridico-template \
  --typescript --tailwind --app --eslint --src-dir

cd estudio-juridico-template

# UI system
npx shadcn@latest init

# Formularios y validación
npm install react-hook-form zod @hookform/resolvers

# CMS headless
npm install sanity @sanity/client @sanity/image-url next-sanity

# SEO
npm install next-seo next-sitemap

# Email
npm install resend
```

### 8.3 Variables de entorno (`.env.local`)

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
RESEND_API_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_GA_ID=
```

### 8.4 Esquemas de Sanity a crear

- `areaDePractica`: título, slug, descripción corta, descripción larga (rich text), FAQ (array de pregunta/respuesta), testimonios asociados (referencia)
- `testimonio`: tipo de caso, texto anonimizado, área de práctica (referencia)
- `datosDelEstudio`: nombre, horarios, dirección, teléfono, redes, número de WhatsApp

### 8.5 Estructura de carpetas sugerida

```
src/
  app/
    page.tsx                    → Home
    areas/[slug]/page.tsx       → Landing por especialidad (generateStaticParams desde Sanity)
    equipo/page.tsx
    testimonios/page.tsx
    preguntas-frecuentes/page.tsx
    contacto/page.tsx
    api/lead/route.ts           → Recibe el formulario, envía email + guarda lead en Sanity
  components/
    FormularioCalificador.tsx
    WhatsAppCTA.tsx
    TestimonioCard.tsx
    FAQAccordion.tsx
  lib/
    sanity.ts                   → Cliente de Sanity
    schema-org.ts               → Generadores de JSON-LD (LegalService, FAQPage)
sanity/
  schemas/
    areaDePractica.ts
    testimonio.ts
    datosDelEstudio.ts
```

### 8.6 Clonado para un cliente nuevo

1. Clonar el repo template.
2. Crear un dataset nuevo en Sanity (o proyecto nuevo si se prefiere aislar datos por cliente).
3. Cargar los esquemas y el contenido relevado en Fase 1.
4. Reemplazar paleta/tipografía en `tailwind.config.ts` si el estudio pide identidad propia (opcional, no es el foco del paquete).
5. Configurar variables de entorno en Vercel.
6. Conectar dominio del cliente.
7. Deploy.

### 8.7 Checklist de QA antes de pasar a Fase 5 (Lanzamiento)

- [ ] Lighthouse mobile: Performance ≥ 90, SEO ≥ 95, Accesibilidad ≥ 90
- [ ] Formulario calificador funciona y el deep link de WhatsApp llega con el mensaje correcto
- [ ] Cada `/areas/[slug]` tiene `title`, `description` y JSON-LD propios (verificar con Rich Results Test de Google)
- [ ] Sitemap y robots.txt generados y accesibles
- [ ] Disclaimer legal presente y visible
- [ ] Panel de administración probado por una persona no técnica del equipo (no solo por el desarrollador)

---

## 9. Resumen para la llamada de venta

1. No se vende "una página web", se vende un sistema que filtra consultas y capta clientes por especialidad.
2. Precio único: **USD 1000**, todo incluido según §1. No hay versión "más barata" con menos funciones — hay versión con menos áreas de práctica.
3. El mantenimiento mensual y las automatizaciones avanzadas se ofrecen en el handoff, como el paso natural después de ver el sitio funcionando — no se negocian antes.
4. La prueba de valor es concreta y mostrable: captura de PageSpeed, ficha de Google Business optimizada, y el formulario calificador funcionando en vivo durante la demo.

---

*Fuentes de referencia usadas para el contexto de mercado (posicionamiento y rangos de precio en Argentina): SODI, Sitew, HomeWork, Folio, Tecnesio. Los precios de mercado son orientativos; el precio de este paquete se fija en USD 1000 independientemente de la cotización del peso.*
