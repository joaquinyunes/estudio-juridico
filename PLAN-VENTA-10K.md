# Estudio jurídico (producto ya vendido) — plan de venta (03/11/2026)
Leé primero `..\PLAN-VENTA-10K.md` (veredicto, paquetes **S** y **V**). Rama: `main` (`4413081`, = `integracion` + estado de Vercel). Sin `git push` sin que lo pidas. **Es el único cliente que pagó: no romperlo.** Cada cambio se prueba en una rama y se verifica antes de tocar `main`.

**Frase de venta (a validar):** «Sitio premium para estudios jurídicos con panel de avisos y contenido editable por el estudio (Sanity), sin cuota por página.» Es **el caso de referencia** de todo el portafolio.

## Estado auditado
- ✅ en `main` y en Vercel (`estudio-juridico-tau.vercel.app`, 200 en < 1 s) · axe-core 0 violaciones en 14 páginas · build verde sin variables · CI en `integracion`
- 🚨 **`npm audit`: 2 CRÍTICAS** (`next`, `dompurify`), 9 altas (`adm-zip`, `brace-expansion`, `js-yaml`, `sharp`, `smol-toml`, `undici`, `vite`, `zod`, `source-map-js`), 18 moderadas — **es el sitio que ya está en producción**
- ☐ sin tests automáticos · ☐ Sanity/Resend/WhatsApp sin claves · ☐ Vercel Auth (¿sitio público o con login?) sin decidir · ☐ Render de respaldo (53 s en frío)
- ☐ 1 archivo sin commitear (`PLAN-POR-PROYECTO.md`)

## A. Pasos
- [x] **J1** 🤖 (05/11: next 16.4.5, zod 4.6.7, sanity 6.22, overrides dompurify/undici/js-yaml/smol-toml → 0 críticas · 0 altas · 14 moderadas solo en la CLI de Sanity; build con y sin variables OK; 14 rutas 200; /studio 401/200 con clave) **S1 ya** (está en producción): subir `next` y `dompurify` (críticas) y el resto de altas, en rama `chore/deps-seguridad`; `npm run build` con y sin variables; revisar a mano las 14 páginas y `/studio`.
- [x] **J2** 🤖 *(05/11: hecho y probado en código — 2FA TOTP + clave ≥12, CSP bloqueando, topes y consentimiento en `/api/lead`, `security.txt`, Dependabot, CI con audit; ver `docs/SEGURIDAD.md`. Sin probar: workflow de backup de Sanity (falta token) · 👤 roles de Sanity y prueba de restauración · rate limit en memoria por instancia)* Panel `/studio` y de avisos: S3 rate limit, S4 2FA/credenciales fuertes, S5 (formularios de contacto: validación, anti-spam, honeypot), S7, S2 CSP a bloquear (Sanity necesita orígenes propios), S8, S9, S10 (export periódico del dataset de Sanity), S11, S13.
- [x] **J3** 🤖 *(05/11: `npm test` = 23 pruebas (TOTP, candado del panel, 14+ rutas, formulario) + `npm run test:a11y` = axe en 18 rutas × 2 anchos, 0 violaciones; ambos en el CI)* **Tests mínimos** (no hay ninguno): humo de las 14 rutas, formulario de contacto, axe en CI. Que `npm test` exista y corra en el CI.
- [x] **J4** 🤖 *(05/11: política ampliada, consentimiento exigido y fechado en el servidor, aviso de datos sensibles en el formulario. **Redacción final = 👤 abogado**)* S12: aviso de privacidad y consentimiento en el formulario (es un estudio: **secreto profesional**, datos sensibles) — redacción final con profesional.
- [ ] **J5** 🤖 *(no se hace: solo se pregunta; pendiente de la respuesta del usuario)* *(Opcional WP-35)* CRM liviano de consultas — **preguntar al estudio antes**.
- [ ] 👤 **J6** Claves de Sanity, Resend y WhatsApp (al final) · decidir si se quita Vercel Auth · Render de respaldo con plan que no se duerma.

## B. Para vender (de `..\PLAN-VENTA-10K.md` §4) — este es el que más aporta al resto
- [ ] V2 **precio al que se vendió** — 👤 plantilla en `docs/CASO-DE-EXITO.md` (no se inventó el dato) · [ ] V3 demo con otro «estudio» ficticio — 🟡 el contenido de respaldo ya es un estudio ficticio y `NEXT_PUBLIC_MODO_DEMO` separa demo de real (probado: `0` oculta el aviso); falta 👤 crear el proyecto Vercel de la demo (`docs/NUEVO-ESTUDIO.md`) · [ ] V4 plantilla repetible — 🟡 parte técnica medida desde clon limpio: 85 s; **no cumple < 1 h** porque nombre, historia y monograma están fijos en el código (lista y propuesta en `docs/NUEVO-ESTUDIO.md`) · [ ] V5 manual del estudio — 🟡 `docs/guia-del-panel.md` actualizada (2FA, consultas, «si se cae», capturas del sitio); falta PDF y capturas del panel (necesitan Sanity real) · [ ] V7 uptime — 🟡 `scripts/uptime.sh` probado (OK en producción, falla ante 404) + `.github/workflows/uptime.yml`; el workflow no corre hasta el push; falta Sentry (👤 DSN) · [ ] V8 **caso de éxito** — 🟡 borrador con capturas y métricas reales en `docs/CASO-DE-EXITO.md`; falta publicarlo (sitio de venta) y el dato comercial · [x] V9 Lighthouse (05/11, móvil, producción: inicio 97/100/100/100 · LCP 1,4 s · contacto 100/100/100/100) · [ ] V10 referencia del estudio — 👤 mensaje borrador en `docs/CASO-DE-EXITO.md`

## Salida
☐ 0 críticas/altas ☐ `npm test` en CI ☐ build verde ☐ Vercel y Render 200 en < 3 s ☐ panel protegido con 2FA ☐ caso de éxito publicado
