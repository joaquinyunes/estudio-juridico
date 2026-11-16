# Un estudio nuevo con esta plantilla (V3 demo + V4 repetible)

Estado al 16/11/2026 (rama `feat/plantilla`): **la marca ya no está escrita en el código.** Nombre, nombre legal, monograma, año de fundación, ciudad, fundador, referencia de la dirección y los textos de la portada salen de un solo objeto, `datosDelEstudio` en `src/lib/content.ts`, y se pisan desde Sanity (*Datos del estudio y cifras → Marca del estudio / Textos de la portada*). La línea de tiempo «Historia» también se edita en el panel (nuevo tipo *Historia (línea de tiempo)*).

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

1. Copiar el repositorio (template de GitHub o `git clone` + repo nuevo). `npm ci && npm run build && npm test`: debe terminar en verde **sin variables**.
2. **Marca** — dos caminos, el mismo resultado:
   - *Sin Sanity todavía:* editar el bloque `datosDelEstudio` de `src/lib/content.ts` (unas 16 líneas: nombre, monograma, año, ciudad, fundador, textos).
   - *Con Sanity:* cargar los mismos campos en el panel; lo que quede vacío usa el texto de respaldo.
3. Sanity: crear proyecto y dataset `production`; dataset privado `consultas` (`npx sanity dataset create consultas --visibility private`); invitar al estudio; agregar la URL del sitio en CORS con *credentials*.
4. Vercel: importar el repo, rama `main`, cargar las variables de `docs/DEPLOY-VERCEL.md` §2 (Sanity, `ADMIN_*` con 2FA, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_MODO_DEMO=0`; Resend y WhatsApp al final).
5. Dominio propio y cuentas **a nombre del estudio**; actualizar `NEXT_PUBLIC_SITE_URL` y redeployar.
6. Cargar en el panel: equipo, áreas, historia, cifras, casos y notas (guía: `docs/guia-del-panel.md`) y verificar con la lista de `docs/DEPLOY-VERCEL.md` §5.

### Marcadores en los textos

Los textos de marca aceptan `{nombre}` `{fundador}` `{ciudad}` `{fundacion}` y, con el año de fundación, `{anios}` / `{Anios}` (años en letras: «treinta y nueve», «Treinta y nueve»), más `{abogados}` y `{areas}` (cantidad de personas del equipo y de áreas, en letras). Ejemplo: «{Anios} años en {ciudad} explicando el derecho.» → «Veintiún años en Córdoba explicando el derecho.» Un marcador mal escrito queda a la vista tal cual.

## Lo que se midió (16/11/2026)

| Prueba | Resultado |
|---|---|
| Clon limpio → `npm ci` → build sin variables → 23 pruebas (05/11) | **85 s** |
| Estudio actual, antes y después del cambio: 22 rutas (18 páginas, manifest, imagen OG, robots, sitemap), HTML normalizado | **idénticas** (la imagen OG pesa lo mismo, 58 643 bytes) — `node scripts/volcar-html.mjs <carpeta>` y `diff -r` |
| Un estudio de otro nombre («Ferrer & Quiroga», Córdoba, 2005) sobre un clon: archivos editados / líneas | **1 archivo, 16 líneas**; el sitio compila y muestra nombre, monograma, ciudad, «Veintiún años», fundador y títulos nuevos en portada, equipo, contacto, áreas, pie y manifest |
| Pruebas nuevas | `tests/plantilla.test.ts` (números en letras, marcadores, textos del estudio actual exactos, un estudio distinto sin rastros del anterior) y `tests/marca.test.ts` (falla si alguien vuelve a escribir «Iturbe», «Lavalle», «1987» o «Talcahuano» en un componente) |

## Lo que sigue siendo del estudio de ejemplo (contenido, no código de marca)

Es contenido que se reemplaza en Sanity (o en `content.ts` si no hay panel); no bloquea el sitio, pero hay que cargarlo:

- Equipo (nombres, matrículas, fotos), áreas de práctica, casos, notas, preguntas frecuentes, cifras e **hitos de la historia**.
- Las 4 fotos de archivo de la portada (`/img/…`) y sus pies/alt en `src/app/(sitio)/page.tsx` («Fig. 1 — Palacio del Congreso, Buenos Aires», «Avenida de Buenos Aires con el Obelisco…»): al cambiar la foto, cambiar el texto.
- Colores y tipografías: `src/app/globals.css` (ver `docs/sistema-de-diseno.md`).
- Textos genéricos de Argentina: Colegio Público de la Abogacía, Ley 27.802 de la calculadora, Ley 25.326 de privacidad. Si el estudio es de otro país, revisar `calculadora-indemnizacion` y `legales`.

## Lo que no se pudo probar

- La lectura desde un Sanity real de los campos nuevos y del tipo `hito` (no hay proyecto ni claves): la consulta GROQ ignora los campos vacíos y vuelve al texto de respaldo, pero no se corrió contra un dataset.
- Crear el proyecto de Sanity y el de Vercel de cero, con el tiempo real de la parte manual (cuentas, DNS, claves). Por eso «< 1 h» está demostrado para la parte de código y de marca, **no** para las cuentas de terceros.
