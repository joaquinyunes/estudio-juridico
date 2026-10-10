# Guía del panel de administración (para el estudio)

El panel está en **`tu-sitio.com/studio`**. Tiene **dos llaves**:

1. **Usuario y contraseña del panel** (`ADMIN_USER` / `ADMIN_PASSWORD`): aparece una ventana del navegador antes de cargar nada. Quien no las tiene ve solo "Acceso restringido". Tras 8 intentos fallidos se bloquea 15 minutos.
2. **Login de Sanity** con el email invitado (Google, GitHub o email): solo puede editar quien fue invitado al proyecto en sanity.io/manage.

Los cambios se ven en el sitio en **menos de un minuto**, sin pedirle nada a nadie.

> La contraseña del panel se define como variable de entorno en el hosting (Render → Environment). No se guarda en el código ni en el repositorio. Para cambiarla: cambiar `ADMIN_PASSWORD` en Render y redeployar.

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
