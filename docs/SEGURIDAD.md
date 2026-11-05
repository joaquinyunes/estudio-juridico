# Seguridad — estado y procedimientos (05/11/2026)

Alcance: sitio público, formulario de consultas (`/api/lead`) y panel `/studio`. Es el sitio en producción del único cliente que pagó; cada cambio se prueba en rama (`chore/deps-seguridad`) antes de tocar `main`.

## Estado por punto del paquete S

| Punto | Estado | Detalle |
|---|---|---|
| **S1** dependencias | ✅ | `npm audit --omit=dev`: **0 críticas, 0 altas**, 14 moderadas. Subidas: `next` 16.4.5, `sanity` 6.22, `next-sanity` 13.4, `@sanity/client`, `zod` 4.6.7. `overrides` para `dompurify`, `undici`, y `js-yaml`/`smol-toml` dentro de `@vercel/frameworks`. Las 14 moderadas están en la CLI de Sanity (`oclif`, `uuid`, …); no se cargan en el sitio y `npm audit` solo las «arregla» bajando a `sanity` 5 (cambio mayor, no se hace). El CI falla si vuelve a aparecer una alta (`npm audit --omit=dev --audit-level=high`). |
| **S2** CSP | ✅ con límite | Pasó de «solo reporte» a **bloquear** (`next.config.ts`). Se mantiene `'unsafe-inline'` en scripts y estilos porque Next inyecta scripts en línea; **no protege contra XSS en línea**, sí contra orígenes externos, `object`, `base`, `form` y `frame`. Pasar a *nonces* es el siguiente paso. Revisadas sin violaciones: inicio, contacto, áreas, calculadora, equipo, notas, testimonios y preguntas. El Studio de Sanity queda fuera de estos encabezados (necesita sus propios orígenes). |
| **S3** rate limit | 🟡 | Formulario: 5 envíos / 10 min por IP; `/studio`: bloqueo 15 min tras 8 intentos fallidos por IP. **Se guardan en memoria de cada instancia** (Vercel puede tener varias): frena abuso básico, no un ataque distribuido. Para algo firme: Upstash/Vercel KV. |
| **S4** panel | ✅ | Contraseña mínima de **12 caracteres** (si es más corta, `/studio` se cierra) y **2FA TOTP** opcional con `ADMIN_TOTP_SECRET`. Encima, el login propio de Sanity. Ver «Activar el 2FA». |
| **S5** formulario | ✅ | `zod` en el servidor, honeypot, tope de 8 KB, solo `application/json` (415), consentimiento obligatorio en el servidor, HTML escapado en el correo. No hay Mongo: no aplica NoSQL injection. |
| **S6** webhooks | — | No hay webhooks. |
| **S7** roles y auditoría | 🟡 | Lo da Sanity, no el código: roles por usuario (Administrador / Editor / Colaborador) en *sanity.io/manage → Members* e historial de cada documento. 👤 Invitar solo a quienes editen y quitar lo que sobre. Las consultas viven en un dataset **privado** aparte. |
| **S8** secretos | ✅ | Sin secretos en el repo ni en el historial (14 commits; patrones de `ci.yml` + `re_…`/`sk…`; ningún `.env` versionado). El CI sigue escaneando. No se corrió `gitleaks` (no está instalado); si se instala: `gitleaks detect --log-opts="--all"`. |
| **S9** encabezados | ✅ | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS, CSP, `/.well-known/security.txt`. CORS: la API no emite cabeceras CORS (solo mismo origen). |
| **S10** backups | 🟡 | `.github/workflows/backup-sanity.yml` exporta el dataset cada domingo (30 días de retención). **No probado**: necesita el secreto `SANITY_API_TOKEN` y la variable `SANITY_PROJECT_ID`. 👤 Falta la **prueba de restauración** (ver abajo). El repo debe ser **privado**: el backup de consultas contiene datos personales. |
| **S11** Dependabot | ✅ | `.github/dependabot.yml`: un PR semanal agrupado (minor/patch), sin saltos mayores automáticos. No se puede evitar desde acá que Vercel genere una *preview* por PR: si molesta, `Settings → Git → Ignored Build Step` en Vercel. |
| **S12** datos personales | ✅ borrador | Política ampliada, consentimiento verificado en el servidor y con fecha, aviso de no cargar datos sensibles. **El texto necesita revisión de un abogado antes de darse por final.** |
| **S13** revisión final | ✅ | Este documento. Revisión manual del código nuevo (no se corrió `/security-review`). |

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
