# MAPUC — Style Guide · Maps Edition
### Inspirado en Google Maps · Material funcional, cartográfico

---

## 1. Filosofía de diseño

Esta versión de MAPUC ignora el cristal y el brillo, y adopta el lenguaje de una **herramienta cartográfica de uso diario**: superficies planas, jerarquía por contraste de color (no por transparencia), tarjetas con sombra baja y contenida, y una relación 80/20 entre mapa y UI — el mapa es el protagonista absoluto, la interfaz es utilitaria y se aparta cuando no se necesita.

Principio rector: **"el mapa manda, la UI sirve"**. Ningún componente debe competir visualmente con el trazado del campus; los colores de marca se usan como acentos funcionales de estado, no como decoración de superficie.

---

## 2. Paleta de color

| Nombre | Hex | Uso principal |
|---|---|---|
| **Dark Slate Gray** | `#335C67` | Texto primario, líneas del mapa (calles/edificios), ícono de navegación, botones primarios |
| **Auburn** | `#9E2A2B` | Estado "cerrado / sin cupo", errores, ruta bloqueada |
| **Hunyadi Yellow** | `#E09F3E` | Estado "casi lleno", acento de selección, ruta activa alternativa |
| **Vanilla** | `#FFF3B0` | Fondo de tarjetas informativas, resaltado de edificio seleccionado en el mapa |
| Verde disponibilidad *(derivado)* `#5B8C5A` | — | Estado "disponible", ruta recomendada, confirmaciones |
| Gris neutro `#F5F5F3` | — | Fondo general de la app (equivalente al gris claro de Google Maps) |
| Blanco `#FFFFFF` | — | Superficie de tarjetas y barras |

**Regla de color:** cada color de marca tiene un solo trabajo funcional fijo (igual que Google Maps usa azul = ruta, rojo = pin seleccionado). Nunca reasignar un color a un significado distinto dentro del mismo flujo.

---

## 3. Superficies y elevación

Sin blur, sin transparencia decorativa. La profundidad se comunica con **sombras duras y contenidas** (Material-style), no con desenfoque:

```css
.map-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(51, 92, 103, 0.15),
              0 2px 8px rgba(51, 92, 103, 0.10);
}

.map-sheet {
  background: #FFFFFF;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -2px 12px rgba(51, 92, 103, 0.12);
}
```

Niveles de elevación (dp equivalente):
| Nivel | Sombra | Uso |
|---|---|---|
| 0 | ninguna | Mapa base |
| 1 (2dp) | sutil | Chips de filtro, barra de búsqueda en reposo |
| 2 (4dp) | media | Tarjetas de lista, resultados de búsqueda |
| 3 (8dp) | pronunciada | Bottom sheet expandido, tarjeta de detalle de espacio |
| 4 (12dp) | flotante | FAB, botón de ubicación actual |

---

## 4. Tipografía

| Rol | Fuente | Peso | Notas |
|---|---|---|---|
| Display / Títulos | **Google Sans / Roboto** (o Inter/Manrope como alternativa web) | 600–700 | Nombres de edificios, títulos de sección |
| Cuerpo / UI | **Roboto** (o Inter) | 400–500 | Texto de listas, descripciones |
| Etiquetas de mapa | **Roboto Condensed** | 500 | Nombres de aulas/edificios sobre el mapa mismo, todo mayúsculas para pisos (ej. "PISO 3") |
| Numérico / Datos | **Roboto Mono** | 500 | Contadores "8/30 disponibles", distancias "120 m" |

Escala: 22 / 18 / 16 / 14 / 12 px. `line-height` 1.3 en títulos, 1.5 en cuerpo — ligeramente más generoso que la versión Liquid Glass, porque aquí el fondo es sólido y la lectura debe ser rápida y funcional.

---

## 5. Componentes

### 5.1 Barra de búsqueda
Idéntica en comportamiento a Google Maps: barra blanca fija en la parte superior, `border-radius: 24px`, ícono de menú/hamburguesa a la izquierda, avatar/perfil a la derecha, sombra nivel 1. Al enfocarse, se expande a pantalla completa con historial de búsquedas recientes ("Aula 204", "Biblioteca Central").

### 5.2 Chips de filtro (bajo la barra de búsqueda)
Fila horizontal scrolleable: "Disponible ahora", "Aulas", "Laboratorios", "Salas de estudio", "Baños", "Cafeterías". Chip inactivo: borde Dark Slate Gray 1px, fondo blanco. Chip activo: fondo Dark Slate Gray sólido, texto blanco — sin gradientes ni transparencias.

### 5.3 Pines de mapa
Gota clásica de mapa (drop pin), color sólido según estado:
- Verde disponibilidad → espacio libre
- Hunyadi Yellow → ocupación parcial
- Auburn → sin cupo

Tamaño base 32px, escala a 44px al seleccionarse, con un pequeño "salto" (bounce, 0.3s ease-out) al aparecer — el mismo micro-gesto de caída que usa Google Maps al soltar un pin.

### 5.4 Bottom Sheet de detalle
Se desliza desde abajo, tres estados de altura (peek 15% / medio 50% / expandido 92%), arrastrable con gesto. Header con nombre del espacio, badge de estado (píldora sólida), foto o ilustración del espacio, luego lista de datos: capacidad, horario, piso, facultad, botón primario "Cómo llegar" (Dark Slate Gray sólido, texto vanilla).

### 5.5 Botones
- **Primario**: fondo Dark Slate Gray sólido, texto Vanilla, `border-radius: 24px` (pill), sin sombra decorativa, solo elevación funcional.
- **Secundario**: borde Dark Slate Gray 1.5px, fondo blanco, texto Dark Slate Gray.
- **Destructivo/Alerta**: fondo Auburn sólido, texto blanco (ej. "Reportar espacio cerrado").

### 5.6 FAB (botón flotante)
Círculo blanco sólido 56px, sombra nivel 4, ícono Dark Slate Gray al centro (ubicación actual / brújula, en referencia directa al isotipo de MAPUC). Posición fija esquina inferior derecha.

### 5.7 Líneas de ruta sobre el mapa
Trazo grueso (6–8px) en Dark Slate Gray para la ruta principal recomendada; trazo Hunyadi Yellow más delgado (4px) para rutas alternativas; nunca Auburn en rutas (reservado solo para estados de error/bloqueo).

### 5.8 Tarjetas de lista (vista alternativa al mapa)
Fila horizontal: ícono de categoría en círculo de color pastel derivado (ej. Vanilla para aulas, verde claro para exteriores), nombre + subtítulo (piso · facultad), badge de estado a la derecha, chevron de navegación.

---

## 6. Motion / Animación

- Transiciones funcionales, cortas y directas: 150–250ms `ease-out`, nunca springs exagerados.
- El bottom sheet usa arrastre con física de "snap" a los tres estados de altura, igual que Google Maps.
- Los pines "caen" al cargar el mapa (stagger de 40ms entre cada uno si hay varios visibles).
- Sin efectos ambientales, sin brillos, sin parallax — el movimiento siempre comunica una acción del usuario, nunca decoración pasiva.

---

## 7. Accesibilidad

- Todos los estados de color van acompañados de forma/ícono distinto (círculo lleno vs. contorno vs. tachado), no solo tono, para usuarios con daltonismo.
- Contraste mínimo AA en todo texto sobre superficies sólidas (fácil de garantizar al no usar transparencia).
- Área táctil mínima de 44×44px en todos los pines y botones del mapa, siguiendo lineamientos de mapas táctiles.

---

## 8. Elemento firma

**El "pin-brújula"**: en lugar del pin de gota genérico, el marcador de ubicación actual del usuario adopta la forma de la aguja del isotipo de MAPUC (roja/azul, apuntando a la orientación real del dispositivo vía brújula del teléfono) — un pequeño detalle cartográfico que conecta el logo con la función más usada de la app.
