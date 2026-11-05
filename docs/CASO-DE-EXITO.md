# Caso de éxito — sitio premium para estudio jurídico

> Borrador listo para publicar. **Lo que está marcado «👤 completar» no se inventó:** lo tiene que poner quien vendió el sitio. Mediciones del 05/11/2026 sobre `https://estudio-juridico-tau.vercel.app`.

**En una línea (a validar con el estudio):** sitio premium para estudios jurídicos, con avisos y contenido que el propio estudio edita (Sanity), sin cuota por página.

## El problema

Un estudio jurídico necesita que el cliente confíe en 10 segundos, que la consulta llegue calificada (área, urgencia, resumen) y poder cambiar un aviso —feria judicial, horario— sin llamar a nadie.

## Qué se entregó

- 18 páginas: inicio, 5 áreas de práctica, equipo, casos resueltos, índice y 3 notas, preguntas frecuentes, calculadora de indemnización, contacto, 2 legales y la página sin conexión.
- Formulario calificador que abre WhatsApp con el caso ya escrito y, con las claves de Resend cargadas, envía copia por correo.
- Panel `/studio` para que el estudio edite avisos, notas, casos, equipo, horarios y cifras (con 2FA).
- Instalable como app (PWA) y con página sin conexión.
- Política de privacidad (Ley 25.326), consentimiento registrado y secreto profesional respetado.

## Métricas reales (no estimadas)

| Medición | Resultado | Cómo se midió |
|---|---|---|
| Lighthouse móvil, inicio | **97** rendimiento · **100** accesibilidad · **100** buenas prácticas · **100** SEO | Lighthouse 13.6.0, móvil, sitio en producción |
| Lighthouse móvil, contacto | **100 / 100 / 100 / 100** | ídem |
| Carga (inicio, móvil) | LCP **1,4 s** · FCP 1,4 s · CLS **0** · TBT 150 ms · 555 KiB | ídem |
| Accesibilidad WCAG 2.1 A/AA | **0 violaciones** en 18 páginas, a 1280 px y a 375 px | axe-core, `npm run test:a11y` |
| Pruebas automáticas | **23** (candado del panel, 2FA, todas las rutas, formulario) | `npm test`, corre en el CI |
| Dependencias | **0 críticas, 0 altas** en producción | `npm audit --omit=dev` |
| Seguridad web | CSP aplicada, HSTS, `security.txt`, 2FA del panel | `docs/SEGURIDAD.md` |

Capturas (`docs/capturas/`, generadas con `scripts/capturas.mjs`): `inicio-escritorio.jpg`, `inicio-celular.jpg`, `contacto-*.jpg`, `area-laboral-*.jpg`, `calculadora-*.jpg`.

## Lo comercial (👤 completar)

- **Precio al que se vendió:** USD ________ — **qué incluyó:** ________ (el tribunal pidió este dato como prueba de que el precio se paga).
- **Fecha de entrega y plazo real de trabajo:** ________
- **Cuota de mantenimiento, si hay:** ________
- **Cita del estudio** (con autorización por escrito): «________» — nombre y cargo: ________

### Mensaje para pedir la referencia (V10, para enviar vos)

> Hola [nombre]: ya tienen el sitio funcionando hace [tiempo]. Para mostrar el trabajo a otros estudios me sirve una frase suya sobre cómo les resultó (qué cambió para ustedes, si les llegan consultas mejor armadas, si editan solos el contenido). Si prefieren, la redacto yo y me dicen si están de acuerdo. ¿Me autorizan a publicarla con el nombre del estudio, o prefieren que sea anónima? Gracias.

## Para publicar

Esta página es un documento. Para publicarla como página de venta del producto (V8 del plan común) falta decidir el sitio donde vive (no el del estudio) y cargar las capturas.
