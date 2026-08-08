# MAPUC — Style Guide · Liquid Glass Edition
### Inspirado en iOS 26/27 · Liquid Glass · Componentes tipo Apple

---

## 1. Filosofía de diseño

MAPUC en su versión **Liquid Glass** trata el campus como un espacio físico que se "asoma" a través de capas de vidrio traslúcido. La interfaz no compite con el mapa: flota sobre él. Cada panel, tarjeta o control es una lámina de cristal curvo que refracta el color del contenido debajo — verdes de áreas libres, ámbar de zonas ocupadas, rojo de espacios cerrados — de modo que el color siempre viene del *dato*, nunca del *chrome*.

Principio rector: **"el vidrio informa, no decora"**. Todo blur, brillo o refracción debe comunicar jerarquía (qué está más cerca del usuario) o estado (disponible / ocupado / restringido), nunca ser gratuito.

---

## 2. Paleta de color

| Nombre | Hex | Uso principal |
|---|---|---|
| **Dark Slate Gray** | `#335C67` | Texto primario, iconografía, bordes de vidrio, base del mapa nocturno |
| **Auburn** | `#9E2A2B` | Estado "ocupado / no disponible", alertas, acento crítico |
| **Hunyadi Yellow** | `#E09F3E` | Estado "parcial / próximo a llenarse", acentos interactivos, highlights de selección |
| **Vanilla** | `#FFF3B0` | Fondo cálido claro, superficies de vidrio en modo día, resplandor ambiental |
| Verde disponibilidad *(derivado)* `#7A9D7E` | — | Estado "disponible" (extraído del acento verde del isotipo del logo) |
| Blanco vidrio `#FFFFFF` a 10–40% opacidad | — | Base de todas las superficies de cristal |

**Regla de vidrio + color:** el color de estado (verde/ámbar/auburn) se aplica como *tinte* dentro del material de vidrio (`background-color` a 12–18% de opacidad sobre blur), nunca como relleno sólido. El sólido se reserva para badges pequeños y el logo.

---

## 3. Material "Liquid Glass" — especificación técnica

Todo componente elevado usa esta receta base (valores CSS de referencia):

```css
.glass-surface {
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 28px;
  box-shadow:
    0 8px 32px rgba(51, 92, 103, 0.18),   /* sombra ambiental, Dark Slate Gray */
    inset 0 1px 1px rgba(255, 255, 255, 0.6),  /* borde especular superior */
    inset 0 -1px 8px rgba(255, 255, 255, 0.15); /* rebote de luz inferior */
}
```

Niveles de vidrio (elevación):

| Nivel | Blur | Opacidad base | Uso |
|---|---|---|---|
| **Vidrio 1 — Ambiente** | 12px | 8% | Barra de estado, fondo de navegación inferior |
| **Vidrio 2 — Contenido** | 24px | 14% | Tarjetas de espacio, hojas modales (bottom sheets) |
| **Vidrio 3 — Foco** | 36px | 20% | Modales, buscador expandido, tarjeta de detalle de aula |
| **Vidrio 4 — Burbuja flotante** | 40px | 24% + brillo especular animado | Botón de ubicación actual, FAB de "Reportar espacio libre" |

**Especularidad ("sheen")**: en componentes interactivos (botones, burbujas), agregar un gradiente lineal sutil de 120° que simula un reflejo curvo de vidrio, animado a 3–4% de desplazamiento en `:hover`/`:active` para dar sensación táctil de burbuja.

---

## 4. Tipografía

| Rol | Fuente | Peso | Notas |
|---|---|---|---|
| Display / Títulos | **SF Pro Display** (o Inter como alternativa web) | 700–800 | Tracking ligeramente negativo (-1%), como títulos de app nativa iOS |
| Cuerpo / UI | **SF Pro Text** (o Inter) | 400–500 | Alto contraste sobre vidrio: siempre Dark Slate Gray sólido, nunca semitransparente |
| Numérico / Datos (aforo, hora) | **SF Mono / Roboto Mono** | 500 | Tabular nums para contadores de disponibilidad (ej. "12/40 asientos") |

Escala tipográfica: 34 / 28 / 22 / 17 / 15 / 13 px, con `line-height` 1.2 en títulos y 1.45 en cuerpo.

Sobre vidrio, el texto **siempre** lleva una sombra sutil (`0 1px 2px rgba(51,92,103,0.15)`) para garantizar legibilidad sin perder la sensación de estar "flotando".

---

## 5. Componentes

### 5.1 Barra de navegación / Tab bar inferior
Cápsula flotante (Vidrio 1), separada 16px del borde inferior de la pantalla, `border-radius: 32px`, iconos SF Symbols-style en Dark Slate Gray, ítem activo con burbuja Hunyadi Yellow translúcida detrás del ícono.

### 5.2 Tarjetas de espacio (aula, laboratorio, sala de estudio)
Vidrio 2, esquinas 24px. Header con nombre del espacio + badge de estado circular (sólido, sin transparencia):
- 🟢 Verde disponibilidad → "Libre"
- 🟡 Hunyadi Yellow → "Ocupación parcial"
- 🔴 Auburn → "Ocupado"

Al expandir (tap), la tarjeta se transforma en Vidrio 3 con animación de morph tipo *sheet* (spring, 0.4s, damping 0.85), mostrando horario, capacidad y mapa mini.

### 5.3 Buscador
Cápsula Vidrio 3 fija en la parte superior, alto 52px, con blur intensificado al hacer scroll del mapa debajo (efecto "profundidad dinámica"). Ícono de lupa Dark Slate Gray, placeholder "Buscar aula, piso o facultad".

### 5.4 Botón flotante principal (FAB)
Burbuja circular Vidrio 4, 56px, con el acento Hunyadi Yellow como tinte interno y brillo especular animado en reposo (pulso muy sutil cada 4s, opacidad 0→8%→0). Ícono "+" o pin para reportar disponibilidad.

### 5.5 Modal / Hoja inferior (Bottom Sheet)
Vidrio 3, se desliza desde abajo cubriendo 60–90% de pantalla, con "grabber" (barrita) Dark Slate Gray al 30% opacidad en la parte superior. Fondo del mapa detrás se desenfoca progresivamente (blur del contenido subyacente, no solo del panel).

### 5.6 Chips de filtro (Facultad, Tipo de espacio, Piso)
Cápsulas pequeñas Vidrio 1, texto Dark Slate Gray; al seleccionarse pasan a relleno sólido Hunyadi Yellow con texto blanco/vanilla.

### 5.7 Pines de mapa
Gota (drop) con base en Dark Slate Gray sólido y "ventana" de vidrio interior mostrando el ícono del tipo de espacio (aula, biblioteca, cafetería). Al seleccionar, el pin escala 1.15x y emite un halo de vidrio expansivo (ripple).

---

## 6. Motion / Animación

- **Spring physics** en todas las transiciones de tarjetas y modales (tensión alta, fricción media) — nunca `ease-linear`.
- **Parallax sutil**: al hacer scroll de la lista de espacios, el fondo de mapa se desplaza a 60% de la velocidad del contenido (sensación de profundidad de capas de vidrio).
- **Micro-interacción táctil**: todo botón de vidrio se comprime 3% y aumenta blur +4px en `:active`, simulando presión sobre una burbuja real.
- Reducir motion: respetar `prefers-reduced-motion`, sustituyendo springs por fades de 150ms.

---

## 7. Accesibilidad

- Contraste de texto sobre vidrio verificado en el peor caso (mapa satelital claro detrás): mínimo AA (4.5:1) — por eso el texto nunca es semitransparente, solo el fondo.
- Estados de color (verde/ámbar/auburn) siempre acompañados de ícono o texto, no solo color.
- Focus visible: anillo de 2px Hunyadi Yellow sólido alrededor de cualquier elemento con foco de teclado, incluso sobre vidrio.

---

## 8. Elemento firma

**La "burbuja de disponibilidad"**: el punto central del mapa que representa a cada espacio no es un pin plano, sino una micro-esfera de vidrio con el color de estado disuelto adentro como líquido — un guiño literal a "Liquid Glass" aplicado al dato más importante de la app: *¿está libre este espacio, ahora mismo?*
