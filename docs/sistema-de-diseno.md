# Sistema de diseño "Folio"

El sitio se presenta como un código legal anotado: papel, tinta, numeración por "§" y "Art.", y un único acento rojo lacre (el de los sellos). Evita a propósito el navy + dorado que usa casi todo el rubro.

Todos los tokens viven en `src/app/globals.css` (`@theme`), así que cambiar la identidad para otro estudio es cambiar esos valores.

## Color

| Token | Valor | Uso |
|---|---|---|
| `papel` | `#f3ede2` | Fondo general |
| `papel-2` / `papel-3` | `#e9e1d2` / `#ddd3c0` | Secciones alternas, carpetas de expediente |
| `tinta` | `#17150f` | Texto principal, botones primarios |
| `tinta-2` / `tinta-3` | `#45413a` / `#5c574d` | Texto secundario / rótulos (AA sobre todos los papeles) |
| `lacre` | `#8c2a1c` | Único acento: palabras enfatizadas, numeración, foco |
| `lacre-claro` | `#e0876f` | Acento sobre fondos oscuros |
| `noche` | `#1c1a15` | Secciones oscuras (calculadora, historia, pie) |
| `linea` | `#cbc0ab` | Filetes y bordes |

## Tipografía

- **Fraunces** (display, eje `opsz`): titulares con `.display`; la palabra clave va en `<em>` y se pinta en lacre.
- **Geist** (texto).
- **Geist Mono** (rótulos `.rotulo`): carátulas de expediente, números de sección, matrículas.

## Recursos gráficos

- **Arco** (`.arco`): marco de ventana neoclásica para fotos y retratos.
- **Foto** (`.foto`): monocromo cálido unificado; así cualquier foto nueva queda coherente.
- **Filete doble** (`.filete-doble`): separador de documento legal.
- **Capitular** (`.capitular`): letra inicial en lacre para párrafos de apertura.
- **Sello** (`<Sello />`): marca del estudio con texto circular animado.
- **Expediente** (`<TestimonioCard />`): testimonios como carátulas con sello "Resuelto".
- **Marquesina** de áreas y **línea de tiempo** deslizable.

## Movimiento

- Titulares que suben línea por línea (`.linea-titular`).
- Entradas al hacer scroll con `animation-timeline: view()`: CSS puro, sin JavaScript; los navegadores que no lo soportan muestran todo estático.
- Todo se desactiva con `prefers-reduced-motion`.
- Nada que esté sobre el pliegue arranca invisible (protege el LCP).

## Accesibilidad

- Contraste AA verificado con Lighthouse (100 en accesibilidad en todas las páginas).
- Link "Saltar al contenido", foco visible en lacre, FAQs con `<details>` nativo, menú mobile con `aria-expanded` y cierre con Escape.
