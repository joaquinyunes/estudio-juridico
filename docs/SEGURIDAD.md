# Seguridad — estado y procedimientos (05/11/2026)

Alcance: sitio público, formulario de consultas (`/api/lead`) y panel `/studio`. Es el sitio en producción del único cliente que pagó; cada cambio se prueba en rama (`chore/deps-seguridad`) antes de tocar `main`.

## Estado por punto del paquete S

| Punto | Estado | Detalle |
|---|---|---|
| **S1** dependencias | ✅ | `npm audit --omit=dev`: **0 críticas, 0 altas**, 14 moderadas. Subidas: `next` 16.4.5, `sanity` 6.22, `next-sanity` 13.4, `@sanity/client`, `zod` 4.6.7. `overrides` para `dompurify`, `undici`, y `js-yaml`/`smol-toml` dentro de `@vercel/frameworks`. Las 14 moderadas están en la CLI de Sanity (`oclif`, `uuid`, …); no se cargan en el sitio y `npm audit` solo las «arregla» bajando a `sanity` 5 (cambio mayor, no se hace). El CI falla si vuelve a aparecer una alta (`npm audit --omit=dev --audit-level=high`). |
| **S2** CSP | ✅ con límite | Pasó de «solo reporte» a **bloquear** (`next.config.ts`). Se mantiene `'unsafe-inline'` en scripts y estilos porque Next inyecta scripts en línea; **no protege contra XSS en línea**, sí contra orígenes externos, `object`, `base`, `form` y `frame`. Pasar a *nonces* es el siguiente paso. `npm run test:a11y` revisa la consola de las 18 páginas a 2 anchos y falla ante cualquier violación. Revisadas sin violaciones: inicio, contacto, áreas, calculadora, equipo, notas, testimonios y preguntas. El Studio de Sanity queda fuera de estos encabezados (necesita sus propios orígenes). |
| **S3** rate limit | 🟡 | Formulario: 5 envíos / 10 min por IP **y** 100 por hora en total (`LEADS_MAX_POR_HORA`). `/studio`: bloqueo 15 min tras 8 intentos fallidos por IP **y** tras 40 en total. La IP sale del encabezado de Vercel o, fuera de Vercel, de la última entrada de `x-forwarded-for` (la de la izquierda la escribe el atacante). **Los contadores viven en la memoria de cada instancia** (Vercel puede tener varias): frenan abuso básico, no un ataque distribuido. Para algo firme: Upstash/Vercel KV. |
| **S4** panel | ✅ | Contraseña mínima de **12 caracteres** (si es más corta, `/studio` se cierra) y **2FA TOTP** opcional con `ADMIN_TOTP_SECRET`. Encima, el login propio de Sanity. Ver «Activar el 2FA». |
| **S5** formulario | ✅ | `zod` en el servidor, honeypot, tope de 8 KB (por `Content-Length` y por lo leído), solo `application/json` (415), consentimiento obligatorio en el servidor, HTML escapado en el correo, `Origin`/`Sec-Fetch-Site` del mismo sitio (403 si no), área validada contra las reales y su nombre puesto por el servidor, sin caracteres de control en el nombre (asunto del correo), respuesta sin datos de configuración. No hay Mongo: no aplica NoSQL injection. |
| **S6** webhooks | — | No hay webhooks. |
| **S7** roles y auditoría | 🟡 | Lo da Sanity, no el código: roles por usuario (Administrador / Editor / Colaborador) en *sanity.io/manage → Members* e historial de cada documento. 👤 Invitar solo a quienes editen y quitar lo que sobre. Las consultas viven en un dataset **privado** aparte. |
| **S8** secretos | ✅ | Sin secretos en el repo ni en el historial (14 commits; patrones de `ci.yml` + `re_…`/`sk…`; ningún `.env` versionado). El CI sigue escaneando. No se corrió `gitleaks` (no está instalado); si se instala: `gitleaks detect --log-opts="--all"`. |
| **S9** encabezados | ✅ | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS, CSP, `/.well-known/security.txt`. CORS: la API no emite cabeceras CORS (solo mismo origen). |
| **S10** backups | 🟡 | `.github/workflows/backup-sanity.yml` exporta el dataset cada domingo (30 días de retención). **No probado**: necesita el secreto `SANITY_API_TOKEN` y la variable `SANITY_PROJECT_ID`. 👤 Falta la **prueba de restauración** (ver abajo). **El repositorio hoy es público**, por eso el workflow solo exporta el dataset de consultas (datos personales) si el repositorio es privado: los artefactos los puede bajar cualquiera que vea el repo. |
| **S11** Dependabot | ✅ | `.github/dependabot.yml`: un PR semanal agrupado (minor/patch), sin saltos mayores automáticos. No se puede evitar desde acá que Vercel genere una *preview* por PR: si molesta, `Settings → Git → Ignored Build Step` en Vercel. |
| **S12** datos personales | ✅ borrador | Política ampliada, consentimiento verificado en el servidor y con fecha, aviso de no cargar datos sensibles. **El texto necesita revisión de un abogado antes de darse por final.** |
| **S13** revisión final | ✅ | Este documento. Revisión manual del código nuevo (no se corrió `/security-review`). |

## Revisión adversaria del código propio (20/11/2026)

Método: leer cada superficie pública como atacante, escribir primero la prueba (`tests/seguridad.test.ts`, `tests/humo.test.ts`, `tests/proxy.test.ts`) y recién después arreglar. 45 pruebas pasan.

| # | Hallazgo | Gravedad | Arreglo |
|---|---|---|---|
| 1 | El tope por IP del formulario y el bloqueo de `/studio` usaban la primera entrada de `x-forwarded-for`, que escribe el cliente fuera de Vercel: rotándola se evitaban los topes y se podía **adivinar la contraseña sin límite**. | Alta | `ipDelCliente`: encabezado de Vercel o última entrada; pruebas con 8 y 7 intentos rotando el encabezado. |
| 2 | Fuerza bruta repartida entre muchas IPs no tenía tope. | Media | Tope global: 40 fallos / 15 min en `/studio`, 100 envíos / hora en el formulario (protege la cuota de Resend y la bandeja). |
| 3 | `/studio` no llevaba ningún encabezado de seguridad: **se podía embeber el panel en otro sitio** (clickjacking). | Media | `X-Frame-Options`, `frame-ancestors 'self'`, `nosniff`, HSTS en `/studio` y en las respuestas del candado (401/404/429). |
| 4 | El workflow de backup subía las **consultas (datos personales) como artefacto de un repositorio público**. | Alta (latente: no corrió, falta el token) | Solo se exportan si el repositorio es privado. |
| 5 | El formulario aceptaba POST de otros sitios (spam y CSRF desde páginas ajenas). | Media | Rechaza `Origin`/`Sec-Fetch-Site` ajenos (403) sin consumir el tope de la víctima. |
| 6 | Un nombre con salto de línea llegaba al asunto del correo (inyección de encabezados). | Media | Se rechazan caracteres de control (400). |
| 7 | El área y su nombre venían del navegador: se podía poner texto arbitrario en el asunto del correo al estudio. | Baja | El área se valida contra las reales y el nombre lo pone el servidor. |
| 8 | La respuesta del formulario decía si Resend y Sanity estaban configurados. | Baja | Solo `{ ok: true }`. |
| 9 | El enlace del aviso (editable en Sanity) podía ser `javascript:`. | Baja (lo edita el estudio) | `enlaceSeguro`: solo rutas del sitio o http(s). |
| 10 | Un marcador `{constructor}` en un texto editable devolvía una función de `Object`. | Baja | `Object.hasOwn`. |
| 11 | Los errores del formulario se logueaban con el objeto completo (podían arrastrar datos personales). | Baja | Solo el mensaje. |

**Revisado sin hallazgos:** JSON-LD (escapa `<`), el único `dangerouslySetInnerHTML`; el service worker (no toca `/api`, `/studio` ni otros dominios); `?area=` (se valida contra las áreas reales); enlaces `tel:`/WhatsApp (se limpian a dígitos); imágenes remotas (solo `cdn.sanity.io`); secretos (ninguno en el repo ni en variables `NEXT_PUBLIC_*`; `SANITY_API_TOKEN` solo en el servidor); comparación de la contraseña en tiempo constante.

**Aceptado y documentado:** el código TOTP puede reutilizarse en su ventana (el navegador reenvía la misma credencial en cada pedido, no se puede invalidar); la CSP mantiene `'unsafe-inline'`; los contadores son por instancia; un atacante puede bloquear `/studio` 15 minutos gastando el tope global (cuesta esperar, no hay acceso); `mailto:` con el email que carga el estudio.

## Activar el 2FA del panel (👤, una vez)

1. Generar: `node scripts/generar-totp.mjs` → imprime `ADMIN_TOTP_SECRET=…` y un enlace `otpauth://…`.
2. Cargar la app autenticadora (Google Authenticator, Authy, 1Password) con ese secreto («ingresar clave de configuración»).
3. En Vercel → Settings → Environment Variables: `ADMIN_PASSWORD` (≥ 12 caracteres), `ADMIN_TOTP_SECRET`. Redeploy.
4. Al abrir `/studio`, el navegador pide usuario y contraseña: se escribe **la contraseña seguida de los 6 dígitos**, sin espacio (`mi-clave-larga123456`).

Límites: el código vale ±30 s y puede reutilizarse en esa ventana; el navegador guarda la credencial, así que al **recargar** pasados ~90 s hay que volver a escribir clave + código nuevo (cuenta como intento fallido para el bloqueo de 8). Para sacar el 2FA, borrar `ADMIN_TOTP_SECRET`.

## Restaurar un backup (a probar en un dataset de prueba antes de necesitarlo)

```bash
npx sanity dataset create restauracion-prueba --project <ID>
npx sanity dataset import backup-contenido-AAAA-MM-DD.tar.gz restauracion-prueba --project <ID>
```
Verificar cantidad de documentos y abrir el sitio apuntando a ese dataset (`NEXT_PUBLIC_SANITY_DATASET`). Anotar fecha y resultado acá: **pendiente**.

## Pedidos de acceso, rectificación o supresión (Ley 25.326)

Se reciben en el correo del estudio. Para ubicar a una persona: en *Vision* del Studio, dataset de consultas, `*[_type=="lead" && nombre match "Apellido*"]`; para suprimir, borrar el documento (y los correos de Resend que contengan el resumen). Responder dentro de los plazos de la ley (10 días corridos para acceso).

## Pendiente que no depende del código

- 👤 Claves reales (Sanity, Resend, token de backup), invitaciones y roles de Sanity, prueba de restauración.
- 👤 Revisión legal de la política de privacidad y de los términos; inscripción de la base de datos ante la AAIP si corresponde.
- Pasar la CSP a *nonces* y el rate limit a un almacén compartido.
