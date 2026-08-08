# Base de datos de MAPUC

## 1. Motor y convenciones

MAPUC utiliza PostgreSQL con PostGIS. El modelo esta dividido en tres diagramas Mermaid para mantenerlo legible, pero todas las entidades pertenecen a la misma base de datos.

Convenciones:

- nombres en español;
- tablas y columnas en `snake_case`;
- sin tildes ni la letra `ñ` en identificadores;
- claves primarias UUID, salvo catalogos pequenos;
- fechas almacenadas con zona horaria;
- geometria bajo un SRID definido durante la importacion;
- contrasenas y tokens no se almacenan en esta base; pertenecen al proveedor OIDC.

## 2. Identidad, preferencias y actividad

```mermaid
erDiagram
    USUARIOS {
        uuid id PK
        string sujeto_autenticacion UK
        string correo UK
        string nombres
        string apellidos
        string estado
        datetime creado_en
        datetime actualizado_en
        datetime ultimo_acceso_en
    }

    ROLES {
        smallint id PK
        string codigo UK
        string nombre
        string descripcion
    }

    USUARIO_ROLES {
        uuid usuario_id PK, FK
        smallint rol_id PK, FK
        uuid asignado_por_id FK
        datetime asignado_en
    }

    PREFERENCIAS_USUARIO {
        uuid usuario_id PK, FK
        boolean notificar_alertas
        boolean notificar_aforo
        boolean preferir_rutas_accesibles
        string apariencia_mapa
        string idioma
        datetime actualizado_en
    }

    LUGARES_GUARDADOS {
        uuid usuario_id PK, FK
        uuid lugar_id PK, FK
        datetime guardado_en
    }

    ACTIVIDAD_LUGARES {
        uuid id PK
        uuid usuario_id FK
        uuid lugar_id FK
        string tipo_actividad
        datetime ocurrido_en
    }

    BUSQUEDAS_RECIENTES {
        uuid id PK
        uuid usuario_id FK
        string texto
        json filtros
        datetime buscado_en
    }

    NOTIFICACIONES {
        uuid id PK
        uuid usuario_id FK
        uuid lugar_id FK
        uuid alerta_id FK
        uuid reporte_id FK
        string tipo
        string titulo
        string contenido
        boolean leida
        datetime creada_en
        datetime leida_en
        datetime expira_en
    }

    AUDITORIAS {
        uuid id PK
        uuid actor_usuario_id FK
        string accion
        string tipo_recurso
        string recurso_id
        json datos_anteriores
        json datos_nuevos
        string direccion_ip_hash
        datetime creado_en
    }

    USUARIOS ||--o{ USUARIO_ROLES : posee
    ROLES ||--o{ USUARIO_ROLES : concede
    USUARIOS o|--o{ USUARIO_ROLES : asigna
    USUARIOS ||--o| PREFERENCIAS_USUARIO : configura
    USUARIOS ||--o{ LUGARES_GUARDADOS : guarda
    USUARIOS ||--o{ ACTIVIDAD_LUGARES : realiza
    USUARIOS ||--o{ BUSQUEDAS_RECIENTES : ejecuta
    USUARIOS ||--o{ NOTIFICACIONES : recibe
    USUARIOS o|--o{ AUDITORIAS : genera
```

`tipo_actividad` admite inicialmente `VISTO`, `RUTA_INICIADA` y `VISITADO`. Los lugares frecuentes se calculan mediante agregacion; no se necesita una tabla duplicada.

## 3. Cartografia, lugares y rutas

```mermaid
erDiagram
    CONJUNTOS_MAPA {
        uuid id PK
        string nombre
        string tipo_fuente
        string uri_fuente
        string version UK
        integer srid
        string estado
        string checksum
        uuid importado_por_id FK
        datetime importado_en
        datetime publicado_en
    }

    CAMPUS {
        uuid id PK
        uuid conjunto_mapa_id FK
        string codigo UK
        string nombre
        string direccion
        geometry limite
        boolean activo
        datetime actualizado_en
    }

    EDIFICIOS {
        uuid id PK
        uuid campus_id FK
        uuid conjunto_mapa_id FK
        string codigo UK
        string nombre
        geometry geometria
        boolean accesible
        boolean activo
        datetime actualizado_en
    }

    PISOS {
        uuid id PK
        uuid edificio_id FK
        uuid conjunto_mapa_id FK
        integer numero_nivel
        string nombre
        geometry geometria
        boolean activo
    }

    CATEGORIAS {
        uuid id PK
        uuid categoria_padre_id FK
        string codigo UK
        string nombre
        string icono
        string color
        boolean activa
    }

    LUGARES {
        uuid id PK
        uuid campus_id FK
        uuid edificio_id FK
        uuid piso_id FK
        uuid categoria_id FK
        uuid conjunto_mapa_id FK
        string codigo UK
        string nombre
        string descripcion
        integer capacidad_estimada
        geometry geometria
        geometry punto_etiqueta
        boolean accesible
        boolean activo
        datetime actualizado_en
    }

    HORARIOS_LUGAR {
        uuid id PK
        uuid lugar_id FK
        smallint dia_semana
        time abre_a
        time cierra_a
        boolean cerrado
        date valido_desde
        date valido_hasta
    }

    SERVICIOS {
        uuid id PK
        string codigo UK
        string nombre
        string icono
        boolean activo
    }

    LUGAR_SERVICIOS {
        uuid lugar_id PK, FK
        uuid servicio_id PK, FK
        string detalle
    }

    NODOS_RUTA {
        uuid id PK
        uuid campus_id FK
        uuid edificio_id FK
        uuid piso_id FK
        string tipo
        geometry ubicacion
        boolean accesible
        boolean activo
    }

    TRAMOS_RUTA {
        uuid id PK
        uuid nodo_origen_id FK
        uuid nodo_destino_id FK
        string tipo
        geometry geometria
        decimal distancia_metros
        integer duracion_segundos
        decimal pendiente
        boolean accesible
        boolean bidireccional
        boolean activo
    }

    CONJUNTOS_MAPA ||--o{ CAMPUS : versiona
    CONJUNTOS_MAPA ||--o{ EDIFICIOS : importa
    CONJUNTOS_MAPA ||--o{ PISOS : importa
    CONJUNTOS_MAPA ||--o{ LUGARES : importa
    CAMPUS ||--o{ EDIFICIOS : contiene
    EDIFICIOS ||--o{ PISOS : contiene
    CAMPUS ||--o{ LUGARES : contiene
    EDIFICIOS o|--o{ LUGARES : ubica
    PISOS o|--o{ LUGARES : ubica
    CATEGORIAS o|--o{ CATEGORIAS : agrupa
    CATEGORIAS ||--o{ LUGARES : clasifica
    LUGARES ||--o{ HORARIOS_LUGAR : programa
    LUGARES ||--o{ LUGAR_SERVICIOS : ofrece
    SERVICIOS ||--o{ LUGAR_SERVICIOS : describe
    CAMPUS ||--o{ NODOS_RUTA : contiene
    EDIFICIOS o|--o{ NODOS_RUTA : ubica
    PISOS o|--o{ NODOS_RUTA : ubica
    NODOS_RUTA ||--o{ TRAMOS_RUTA : conecta
```

Los campos `edificio_id` y `piso_id` de `LUGARES` son opcionales porque areas verdes, estacionamientos y accesos pueden estar al aire libre. Los nodos y tramos permiten calcular rutas normales, accesibles y transiciones mediante escaleras, rampas o ascensores.

## 4. Aforo, chat, reportes y alertas

```mermaid
erDiagram
    ESTADOS_AFORO {
        uuid lugar_id PK, FK
        string nivel
        integer cantidad_estimada
        string tipo_fuente
        string referencia_fuente
        decimal confianza
        datetime observado_en
        datetime actualizado_en
    }

    LECTURAS_AFORO {
        uuid id PK
        uuid lugar_id FK
        string nivel
        integer cantidad_estimada
        string tipo_fuente
        string referencia_fuente
        decimal confianza
        datetime observado_en
    }

    SALAS_CHAT {
        uuid id PK
        uuid lugar_id FK
        string motivo_apertura
        string estado
        integer maximo_caracteres
        integer mensajes_por_ventana
        integer segundos_ventana
        datetime abierta_en
        datetime cierra_en
        datetime cerrada_en
    }

    MENSAJES_CHAT {
        uuid id PK
        uuid sala_id FK
        uuid usuario_id FK
        string contenido
        string estado_moderacion
        datetime creado_en
        datetime ocultado_en
        datetime expira_en
    }

    REPORTES_MENSAJE {
        uuid id PK
        uuid mensaje_id FK
        uuid usuario_id FK
        string motivo
        string estado
        datetime creado_en
        datetime resuelto_en
    }

    REPORTES {
        uuid id PK
        uuid lugar_id FK
        uuid usuario_id FK
        string tipo
        string descripcion
        string severidad
        string estado
        string clave_idempotencia UK
        uuid resuelto_por_id FK
        datetime creado_en
        datetime resuelto_en
    }

    EVIDENCIAS_REPORTE {
        uuid id PK
        uuid reporte_id FK
        string uri_archivo
        string tipo_mime
        string checksum
        datetime creada_en
    }

    ALERTAS {
        uuid id PK
        uuid lugar_id FK
        uuid reporte_origen_id FK
        uuid creada_por_id FK
        string tipo
        string titulo
        string descripcion
        string severidad
        string fuente
        string estado
        datetime inicia_en
        datetime termina_en
        datetime creada_en
        datetime publicada_en
    }

    EVENTOS_OUTBOX {
        uuid id PK
        string agregado_tipo
        string agregado_id
        string evento_tipo
        integer version_evento
        json contenido
        datetime creado_en
        datetime publicado_en
        integer intentos
    }

    LUGARES ||--o| ESTADOS_AFORO : mantiene
    LUGARES ||--o{ LECTURAS_AFORO : registra
    LUGARES ||--o{ SALAS_CHAT : habilita
    SALAS_CHAT ||--o{ MENSAJES_CHAT : contiene
    USUARIOS ||--o{ MENSAJES_CHAT : envia
    MENSAJES_CHAT ||--o{ REPORTES_MENSAJE : recibe
    USUARIOS ||--o{ REPORTES_MENSAJE : crea
    LUGARES ||--o{ REPORTES : recibe
    USUARIOS ||--o{ REPORTES : crea
    USUARIOS o|--o{ REPORTES : resuelve
    REPORTES ||--o{ EVIDENCIAS_REPORTE : adjunta
    REPORTES o|--o{ ALERTAS : origina
    LUGARES ||--o{ ALERTAS : publica
    USUARIOS ||--o{ ALERTAS : crea
```

El diagrama referencia `USUARIOS` y `LUGARES`, definidos en los diagramas anteriores.

## 5. Catalogos y restricciones

Los estados se implementan con `CHECK`, tablas catalogo o enums de PostgreSQL segun la frecuencia de cambio. Valores iniciales:

| Campo | Valores |
|---|---|
| `usuarios.estado` | `ACTIVO`, `SUSPENDIDO`, `ELIMINADO` |
| `roles.codigo` | `USUARIO`, `MODERADOR`, `ADMINISTRADOR` |
| `conjuntos_mapa.tipo_fuente` | `CAD`, `GEOJSON`, `ARCGIS`, `OTRO` |
| `conjuntos_mapa.estado` | `CARGADO`, `VALIDANDO`, `RECHAZADO`, `LISTO`, `PUBLICADO`, `RETIRADO` |
| `estados_aforo.nivel` | `VACIO`, `POCO`, `MEDIO`, `ALTO`, `LLENO`, `SIN_INFORMACION` |
| `tipo_fuente` de aforo | `SENSOR`, `OFICIAL`, `COMUNIDAD`, `ESTIMACION` |
| `salas_chat.estado` | `PROGRAMADA`, `ABIERTA`, `SUSPENDIDA`, `CERRADA` |
| `mensajes_chat.estado_moderacion` | `VISIBLE`, `REPORTADO`, `OCULTO`, `ELIMINADO` |
| `reportes.estado` | `RECIBIDO`, `EN_REVISION`, `VALIDADO`, `RECHAZADO`, `RESUELTO` |
| `alertas.estado` | `BORRADOR`, `PROGRAMADA`, `ACTIVA`, `FINALIZADA`, `CANCELADA` |
| `alertas.fuente` | `OFICIAL`, `COMUNIDAD_VALIDADA` |

Restricciones importantes:

- `capacidad_estimada >= 0`.
- `cantidad_estimada >= 0` cuando no sea nula.
- `confianza` entre 0 y 1.
- `dia_semana` entre 1 y 7.
- `maximo_caracteres` no mayor a 300 en la configuracion inicial.
- una sala abierta debe tener `abierta_en` y una politica de cierre.
- `termina_en` debe ser posterior a `inicia_en`.
- un tramo debe conectar nodos distintos y tener distancia positiva.
- una alerta comunitaria requiere un reporte validado.

## 6. Indices recomendados

### Geoespaciales

```sql
CREATE INDEX idx_campus_limite_gist ON campus USING GIST (limite);
CREATE INDEX idx_edificios_geometria_gist ON edificios USING GIST (geometria);
CREATE INDEX idx_lugares_geometria_gist ON lugares USING GIST (geometria);
CREATE INDEX idx_nodos_ruta_ubicacion_gist ON nodos_ruta USING GIST (ubicacion);
CREATE INDEX idx_tramos_ruta_geometria_gist ON tramos_ruta USING GIST (geometria);
```

### Busqueda y filtros

```sql
CREATE INDEX idx_lugares_nombre_trgm
ON lugares USING GIN (nombre gin_trgm_ops);

CREATE INDEX idx_lugares_categoria_activo
ON lugares (categoria_id, activo);

CREATE INDEX idx_lugares_edificio_piso
ON lugares (edificio_id, piso_id);
```

### Tiempo y actividad

```sql
CREATE INDEX idx_lecturas_aforo_lugar_fecha
ON lecturas_aforo (lugar_id, observado_en DESC);

CREATE INDEX idx_mensajes_chat_sala_fecha
ON mensajes_chat (sala_id, creado_en DESC);

CREATE INDEX idx_reportes_estado_fecha
ON reportes (estado, creado_en DESC);

CREATE INDEX idx_alertas_estado_periodo
ON alertas (estado, inicia_en, termina_en);

CREATE INDEX idx_notificaciones_usuario_no_leida
ON notificaciones (usuario_id, creada_en DESC)
WHERE leida = FALSE;
```

## 7. Particionamiento y retencion

No se particionan tablas pequenas por anticipado. Cuando las mediciones lo justifiquen:

- `lecturas_aforo`: particion mensual por `observado_en`;
- `mensajes_chat`: particion mensual por `creado_en` y eliminacion segun retencion;
- `auditorias`: particion mensual o trimestral;
- `actividad_lugares`: particion temporal si crece de forma sostenida;
- `eventos_outbox`: limpieza de eventos publicados despues del periodo de auditoria.

La retencion exacta debe aprobarse con responsables de privacidad y seguridad. Ocultar un mensaje en la aplicacion no equivale automaticamente a borrarlo de auditoria.

## 8. Datos que no se guardan directamente

- contrasenas, refresh tokens o secretos de Keycloak;
- presencia WebSocket permanente: se mantiene temporalmente en Redis;
- archivos CAD o fotografias binarias: se guardan en object storage y la base conserva URI y checksum;
- teselas PMTiles: se distribuyen desde storage/CDN;
- rutas calculadas para cada consulta: se calculan desde el grafo y solo se cachean si aporta valor;
- conteo de usuarios conectados como dato historico exacto, salvo que se diseñe una metrica agregada especifica.
