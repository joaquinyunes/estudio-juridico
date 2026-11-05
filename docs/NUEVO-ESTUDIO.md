# Un estudio nuevo con esta plantilla (V3 demo + V4 repetible)

Estado honesto al 05/11/2026: la **parte técnica** de levantar una copia se midió y es corta; la **parte de marca y contenido** todavía exige editar código, así que «un estudio nuevo en < 1 h» **no se cumple aún** (ver «Lo que falta»).

## Dos entornos, nunca mezclados (V3)

| | Demo (para mostrar) | Real (del estudio) |
|---|---|---|
| Proyecto de Vercel | `estudio-juridico-demo` | uno por estudio |
| Contenido | respaldo de `src/lib/content.ts`: **«Iturbe & Lavalle», estudio ficticio** (sin Sanity) | su dataset de Sanity |
| `NEXT_PUBLIC_MODO_DEMO` | sin definir (aviso «estudio ficticio» visible en el pie y en el aviso legal) | `0` |
| Panel `/studio` | sin `ADMIN_PASSWORD` → cerrado (404) | con clave ≥ 12 y 2FA |
| Consultas | el formulario no guarda ni envía (sin claves) | con Resend y dataset privado |

Regla: el entorno real nunca se usa para mostrar. La demo no tiene claves, así que **no puede** recibir datos reales de nadie por error.
👤 Falta crear el proyecto de Vercel de la demo (hoy `estudio-juridico-tau` es la demo con contenido ficticio).

## Procedimiento para un estudio nuevo

**Parte técnica — medida desde un clon limpio (05/11/2026): clonar 1 s + `npm ci` 42 s + `npm run build` 39 s + `npm test` (23 pruebas) 3 s = 85 s.**

1. Copiar el repositorio (template de GitHub o `git clone` + repo nuevo).
2. `npm ci && npm run build && npm test` (debe terminar en verde **sin variables**).
3. Sanity: crear proyecto y dataset `production`; dataset privado `consultas` (`npx sanity dataset create consultas --visibility private`); invitar al estudio; agregar la URL del sitio en CORS con *credentials*.
4. Vercel: importar el repo, rama `main`, cargar las variables de `docs/DEPLOY-VERCEL.md` §2 (Sanity, `ADMIN_*` con 2FA, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_MODO_DEMO=0`; Resend y WhatsApp al final).
5. Dominio propio y cuentas **a nombre del estudio**; actualizar `NEXT_PUBLIC_SITE_URL` y redeployar.
6. Cargar el contenido en el panel (guía: `docs/guia-del-panel.md`) y verificar con la lista de `docs/DEPLOY-VERCEL.md` §5.

## Lo que falta para que sean < 1 h (marca fija en el código)

Hoy estos textos del estudio «Iturbe & Lavalle» están escritos en el código y **no** se cambian desde Sanity; hay que editarlos a mano para otro estudio:

- `src/lib/content.ts`: datos, cifras, áreas, equipo, historia, notas y casos de respaldo (12 menciones de 1987 / Buenos Aires / Tribunales).
- `src/app/(sitio)/page.tsx`: titular, la historia de «Ernesto Iturbe», años y cantidad de abogados.
- `src/components/Sello.tsx` (texto y monograma «I&L»), `SiteHeader.tsx` («Desde 1987»), `SiteFooter.tsx` (nombre grande), `src/app/opengraph-image.tsx`, `src/app/layout.tsx` (descripción), `public/sw.js` (comentario).
- Colores y tipografías: `src/app/globals.css` (ver `docs/sistema-de-diseno.md`).

Cambio propuesto (no hecho, toca la producción): que el nombre, el año de fundación, la ciudad y el monograma salgan de `datosDelEstudio` y que la historia sea un documento de Sanity. Con eso, la parte de marca baja a cargar datos en el panel.

## Lo que no se pudo probar sin cuentas

Crear el proyecto de Sanity y el de Vercel de cero, con el tiempo real de la parte manual (cuentas, DNS, claves).
