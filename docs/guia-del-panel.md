# Guía del panel de administración (para el estudio)

El panel está en **`tu-sitio.com/studio`**. Tiene **dos llaves**:

1. **Usuario y contraseña del panel** (`ADMIN_USER` / `ADMIN_PASSWORD`, de al menos 12 caracteres): aparece una ventana del navegador antes de cargar nada. Quien no las tiene ve solo "Acceso restringido". Tras 8 intentos fallidos se bloquea 15 minutos. Si el sitio tiene **2FA** activado, en el campo de contraseña se escribe la contraseña **seguida de los 6 dígitos** de la app autenticadora, sin espacio (ej.: `mi-clave-larga123456`).
2. **Login de Sanity** con el email invitado (Google, GitHub o email): solo puede editar quien fue invitado al proyecto en sanity.io/manage.

Los cambios se ven en el sitio en **menos de un minuto**, sin pedirle nada a nadie.

> La contraseña del panel se define como variable de entorno en el hosting (Vercel → Settings → Environment Variables). No se guarda en el código ni en el repositorio. Para cambiarla: cambiar `ADMIN_PASSWORD` en Vercel y redeployar.

## Lo que cambia mes a mes

| Quiero… | Dónde | Qué hacer |
|---|---|---|
| Avisar una novedad, feria judicial, cambio de horario | **Aviso del sitio** | Escribir el texto (hasta 140 caracteres). Opcional: enlace y fechas "desde / hasta". Pasada la fecha "hasta" se oculta solo. Para sacarlo antes, apagar **Mostrar el aviso**. |
| Publicar una nota | **Notas y novedades** → + | Título, bajada, fecha, imagen y cuerpo. Aparece en la home, en `/notas` y en el buscador. |
| Agregar un caso resuelto | **Casos resueltos** → + | Sin nombres: solo el N.º de expediente ficticio, tipo de caso, resultado y año. |
| Sumar una pregunta frecuente | **Preguntas frecuentes** → + | Pregunta, respuesta y orden. |
| Cambiar horarios, guardia, teléfono o dirección | **Datos del estudio y cifras** | Editar y publicar. |
| Actualizar las cifras de la portada (años, casos…) | **Datos del estudio y cifras** → Cifras | Hasta 4. Número, unidad y descripción. |
| Alta o baja de un abogado | **Equipo** | Foto, cargo, matrícula, áreas y orden. |

## Reglas simples

- Nada se publica hasta apretar **Publish** (Publicar).
- Los testimonios deben tener autorización y estar anonimizados (secreto profesional).
- Si algo sale mal, el historial de cada documento permite volver a una versión anterior.
- Las consultas del formulario llegan **por email**. Por privacidad no se guardan en el contenido público del panel (si se quiere un historial, se configura un dataset privado: ver `.env.local.example`, `SANITY_LEADS_DATASET`).

## Cómo llegan las consultas

El formulario de contacto abre WhatsApp con el caso ya escrito y envía una copia a `LEADS_EMAIL` (o al email del estudio). Las consultas con urgencia «inmediata» llegan con **URGENTE** en el asunto. Si hay dataset privado de consultas, también quedan en el panel (**Consulta recibida**), con el estado: nuevo → contactado → cliente / descartado.

Cada consulta guarda la fecha en que la persona aceptó la política de privacidad. Si alguien pide ver o borrar sus datos: ver `docs/SEGURIDAD.md`, «Pedidos de acceso, rectificación o supresión».

## Si el sitio se cae

1. Probar `https://tu-sitio.com` desde el celular con datos móviles (descarta tu wifi).
2. Si no abre: revisar https://www.vercel-status.com. Si Vercel está bien, entrar a vercel.com → proyecto → **Deployments**: si el último dice *Error*, elegir el anterior que estaba bien y **Promote to Production** (vuelve al instante).
3. Si el panel `/studio` no abre pero el sitio sí: revisar que `ADMIN_PASSWORD` tenga 12 caracteres o más.
4. Seguir sin resolver: escribir a quien mantiene el sitio con la URL, la hora y una captura.

El repositorio avisa por correo si la portada falla 3 veces seguidas (`.github/workflows/uptime.yml`).

## Capturas

Del sitio publicado, en `docs/capturas/` (escritorio y celular). Las capturas del panel de Sanity se agregan cuando el proyecto de Sanity tenga las claves reales.
