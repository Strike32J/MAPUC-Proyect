# Stack tecnologico de MAPUC

## 1. Resumen ejecutivo

| Area | Tecnologia principal |
|---|---|
| Web | React + TypeScript + Vite |
| UI | Tailwind CSS + shadcn/ui |
| Mapas | MapLibre GL JS + PMTiles/MVT |
| Backend | NestJS + Fastify + TypeScript |
| API | REST con OpenAPI |
| Tiempo real | WebSocket con `WsAdapter` de NestJS |
| Eventos | NATS JetStream |
| Base de datos | PostgreSQL + PostGIS |
| Acceso a datos | TypeORM + SQL espacial controlado |
| Cache y limites | Redis |
| Autenticacion | Keycloak + OpenID Connect + PKCE |
| Archivos cartograficos | Cloudflare R2 o storage S3 compatible |
| Entorno local | Docker Compose |
| Orquestacion productiva | Kubernetes administrado |
| Observabilidad | OpenTelemetry + Prometheus + Grafana + Loki + Sentry |
| Pruebas de carga | k6 |
| CI/CD | GitHub Actions |
| Infraestructura como codigo | Terraform |

Las versiones exactas se fijaran en `package-lock.json`, imagenes con tag inmutable y archivos de infraestructura. No se usara `latest` en produccion.

## 2. Frontend web

### Base

- **React:** composicion de la interfaz y ecosistema maduro.
- **TypeScript:** contratos tipados para API, mapa, aforo y eventos.
- **Vite:** desarrollo y compilacion del SPA/PWA.
- **React Router:** rutas publicas, privadas y administrativas.

### Estado y datos

- **TanStack Query:** consultas, mutaciones, cache de servidor e invalidacion.
- **Zustand:** estado global pequeno de UI, seleccion del mapa y filtros temporales.
- **React Hook Form:** formularios eficientes.
- **Zod:** validacion en el limite del cliente y tipado de formularios.

No se duplicaran en Zustand los datos remotos ya administrados por TanStack Query.

### Interfaz

- **Tailwind CSS:** tokens y estilos consistentes.
- **shadcn/ui:** componentes accesibles que pueden personalizarse con la identidad MAPUC.
- **Lucide React:** iconografia coherente.
- **Radix UI:** primitivas accesibles utilizadas por componentes complejos.
- **CSS custom properties:** colores, espacios, radios y temas.

La paleta base incluye `#335C67`, `#9E2A2B`, `#E09F3E`, `#FFF3B0` y el verde salvia del logo definitivo. Los estados de aforo nunca dependen solo del color.

### Mapas y geolocalizacion

- **MapLibre GL JS:** renderizado WebGL del mapa.
- **PMTiles/MVT:** distribucion de teselas vectoriales mediante CDN.
- **Protocolo PMTiles para MapLibre:** lectura eficiente desde object storage.
- **Geolocation API:** ubicacion del navegador con consentimiento.
- **GeoJSON:** capas dinamicas pequenas, depuracion e intercambio.

### PWA

- **vite-plugin-pwa / Workbox:** service worker, manifiesto y cache controlado.
- El mapa completo no se almacena sin limites. Se definen cuotas y politicas de expiracion.
- Las operaciones sensibles requieren confirmacion del servidor; una cola offline se usa solo si el producto la necesita.

### Calidad web

- **Vitest:** pruebas unitarias.
- **React Testing Library:** pruebas de componentes por comportamiento.
- **MSW:** simulacion de HTTP durante pruebas.
- **Playwright:** flujos end-to-end.
- **axe-core:** comprobaciones automatizadas de accesibilidad.
- **ESLint + Prettier:** reglas y formato.

## 3. Backend NestJS

### Base del servidor

- **Node.js LTS:** runtime soportado y estable.
- **NestJS:** modulos, providers, controladores, guards, pipes e inyeccion de dependencias.
- **`@nestjs/platform-fastify`:** adaptador HTTP con menor overhead que Express para la API.
- **TypeScript:** lenguaje comun del backend, contratos y herramientas.
- **OpenAPI/Swagger:** contrato y documentacion de endpoints.

Fastify se elige para reducir overhead HTTP. Esto no sustituye las pruebas de carga ni resuelve por si solo 100 000 conexiones.

### Validacion y serializacion

- **class-validator + class-transformer:** DTO externos en controladores NestJS.
- **Zod:** opcional en contratos compartidos o eventos internos; no se duplicara una misma validacion en dos librerias sin motivo.
- **Pipes globales:** whitelist, transformacion controlada y rechazo de campos desconocidos.

### Persistencia

- **TypeORM:** migraciones, transacciones y mapeo de entidades de infraestructura.
- **Driver `pg`:** conexion con PostgreSQL.
- **SQL parametrizado:** consultas PostGIS complejas y read models de alto rendimiento.
- **PgBouncer:** pool de conexiones fuera de las replicas NestJS.

Las entidades TypeORM no son las entidades de dominio. Los repositorios adaptan entre ambas representaciones.

### Tiempo real

- **`@nestjs/websockets`:** gateways y ciclo de vida.
- **`WsAdapter` / libreria `ws`:** protocolo WebSocket ligero.
- **NATS:** distribucion de eventos entre replicas.
- **Redis:** presencia, rate limiting, cooldown e idempotencia temporal.

Socket.IO no se usa inicialmente porque MAPUC no necesita todas sus abstracciones y cada conexion debe mantener el menor overhead razonable. Puede reconsiderarse si sus funciones compensan el costo medido.

### Procesos asincronos

- **`@nestjs/microservices` con transporte NATS:** productores y consumidores.
- **NATS JetStream:** persistencia, confirmacion y reentrega de eventos.
- **Transactional Outbox en PostgreSQL:** consistencia entre datos y eventos.
- **Workers NestJS:** notificaciones, moderacion, procesamiento de reportes y publicacion cartografica.

### Autenticacion y seguridad

- **Keycloak:** identidad, registro, recuperacion y futura federacion PUCP.
- **OpenID Connect:** autenticacion estandar.
- **Authorization Code + PKCE:** web y futuro mobile.
- **Passport/JWT validation:** validacion del access token en NestJS.
- **Guards de roles y permisos:** autorizacion.
- **Helmet:** encabezados seguros.
- **CORS con allowlist:** origenes autorizados.
- **Rate limiting distribuido:** Redis, por usuario, IP, ruta y sala.
- **Argon2:** solo si alguna credencial propia excepcional debe almacenarse; las contrasenas normales pertenecen a Keycloak.

### Herramientas backend

- **Jest:** pruebas unitarias e integracion de NestJS.
- **Supertest:** API HTTP.
- **Testcontainers:** PostgreSQL/PostGIS, Redis y NATS reales en integracion.
- **ESLint + Prettier:** calidad y formato.
- **Husky + lint-staged:** opcionales para checks locales rapidos; CI sigue siendo la autoridad.

## 4. Datos

### PostgreSQL + PostGIS

PostgreSQL conserva los datos transaccionales. PostGIS agrega geometria, relaciones espaciales, cercania e indices GiST.

Extensiones iniciales:

- `postgis`;
- `pg_trgm`;
- `unaccent` si la configuracion y los requisitos de busqueda lo permiten;
- `uuid-ossp` o generacion nativa/aplicativa de UUID segun la version adoptada.

### Redis

Usos autorizados:

- cache-aside;
- estado actual de aforo;
- presencia aproximada;
- rate limiting;
- cooldown del chat;
- idempotencia temporal;
- coordinacion breve entre replicas.

Redis no es la fuente unica de reportes, alertas, usuarios ni mensajes persistentes.

### NATS JetStream

NATS transporta eventos de dominio e integracion. JetStream se usa cuando se requiere persistencia, reentrega y consumidores durables. Los payloads son pequenos, versionados y no contienen archivos ni geometria pesada.

### Busqueda

La primera version usa PostgreSQL Full Text Search, `pg_trgm`, indices y filtros PostGIS. OpenSearch/Elasticsearch se incorporaria solo si las metricas muestran que PostgreSQL no cubre relevancia, volumen o latencia.

## 5. Cartografia y archivos

- **GDAL/OGR:** conversion y validacion de CAD, GeoJSON y formatos GIS compatibles.
- **Tippecanoe u otra herramienta validada:** generacion de teselas vectoriales cuando corresponda.
- **PMTiles/MVT:** formato de entrega optimizado.
- **Cloudflare R2 o storage S3 compatible:** fuentes, exportaciones y teselas.
- **CDN:** entrega global y cache de contenido inmutable.
- **PostGIS:** geometria consultable y fuente geoespacial del servidor.

ArcGIS puede seguir siendo una herramienta institucional de edicion. MAPUC debe consumir exportaciones o servicios mediante un adaptador, sin acoplar todo el dominio a un proveedor.

## 6. Infraestructura y despliegue

### Desarrollo local

- **Docker Desktop / Docker Engine:** motor recomendado para el equipo.
- **Docker Compose:** PostgreSQL/PostGIS, Redis, NATS, Keycloak y observabilidad local opcional.
- **Node y npm:** ejecucion de frontend y backend; se puede ejecutar dentro o fuera de contenedores.
- **`.env.example`:** nombres de variables sin secretos.

Podman es compatible con imagenes OCI y puede usarse si una politica institucional exige rootless/daemonless. No aumenta la cantidad de usuarios que soporta MAPUC y puede introducir diferencias en Compose o Windows. Docker es la opcion inicial por experiencia de equipo y compatibilidad.

### Produccion

- **Imagenes OCI multi-stage:** frontend, API, realtime y workers.
- **Registro de contenedores:** GitHub Container Registry u otro registro institucional.
- **Kubernetes administrado:** deployments, services, ingress, autoscaling y rolling updates.
- **containerd o CRI-O:** runtime del cluster.
- **Ingress Controller + WAF:** entrada HTTP/WebSocket.
- **cert-manager o servicio gestionado:** TLS.
- **External Secrets o servicio cloud equivalente:** secretos.
- **Terraform:** infraestructura reproducible.

Kubernetes no es obligatorio para el primer entorno de demostracion. Si el MVP tiene trafico reducido, puede desplegarse inicialmente en una plataforma administrada que soporte WebSockets y servicios separados. La meta de 100 000 conexiones requiere validar limites del proveedor antes de adoptarlo.

## 7. Observabilidad

- **OpenTelemetry:** trazas, metricas y propagacion de contexto.
- **Prometheus:** recoleccion de metricas.
- **Grafana:** dashboards y alertas.
- **Loki:** logs estructurados.
- **Sentry:** errores y performance de frontend/backend.
- **Alertmanager:** notificacion operativa.

Metricas minimas:

- conexiones WebSocket activas y nuevas por segundo;
- mensajes aceptados, rechazados y moderados;
- solicitudes HTTP, tasa de errores, p95 y p99;
- hit rate y memoria de Redis;
- consumidores atrasados en NATS;
- conexiones y consultas lentas de PostgreSQL;
- latencia de busqueda y calculo de ruta;
- errores de publicacion de mapas.

## 8. CI/CD

GitHub Actions ejecuta:

1. instalacion reproducible con `npm ci`;
2. lint y formato;
3. type checking;
4. pruebas unitarias;
5. pruebas de integracion;
6. build de web y backend;
7. analisis de dependencias e imagenes;
8. pruebas end-to-end en ambiente controlado;
9. construccion y publicacion de imagenes OCI;
10. despliegue con aprobacion por ambiente.

Herramientas complementarias:

- **Dependabot o Renovate:** actualizaciones controladas.
- **Trivy:** escaneo de imagenes y dependencias.
- **CodeQL:** analisis estatico.
- **Conventional Commits:** historial consistente.

## 9. Pruebas de rendimiento y resiliencia

- **k6:** HTTP y WebSocket.
- **Toxiproxy o mecanismos equivalentes:** latencia y fallos de dependencias en pruebas.
- **Pruebas de reconexion:** evitar tormentas de reconexion.
- **Pruebas sostenidas:** detectar fugas de memoria y degradacion.

Los escenarios se versionan en `tests/performance/` y se ejecutan primero en un entorno de carga aislado.

## 10. Futuro cliente movil

Si MAPUC se expande a mobile:

| Area | Tecnologia propuesta |
|---|---|
| Framework | Flutter |
| Lenguaje | Dart |
| Estado / DI | Riverpod |
| Navegacion | go_router |
| HTTP | Dio |
| WebSocket | `web_socket_channel` o cliente validado |
| Modelos | json_serializable + freezed |
| Persistencia local | Drift |
| Mapas | SDK compatible con MapLibre y las capas publicadas |
| Seguridad de tokens | Almacenamiento seguro del sistema |
| Pruebas | flutter_test + integration_test |

Mobile consume OpenID Connect con PKCE, REST versionado y eventos compatibles. No accede a PostgreSQL, Redis o NATS directamente.

## 11. Variables de entorno por categoria

No se incluyen valores reales en Git.

```text
# Aplicacion
NODE_ENV=
PORT=
PUBLIC_APP_URL=

# PostgreSQL
DATABASE_URL=
DATABASE_POOL_MIN=
DATABASE_POOL_MAX=

# Redis
REDIS_URL=

# NATS
NATS_SERVERS=
NATS_USER=
NATS_PASSWORD=

# OIDC
OIDC_ISSUER=
OIDC_AUDIENCE=
OIDC_CLIENT_ID=

# Storage
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=

# Observabilidad
OTEL_EXPORTER_OTLP_ENDPOINT=
SENTRY_DSN=
```

## 12. Decision final

El stack inicial recomendado es:

**React + TypeScript + MapLibre en web; NestJS + Fastify para REST y WebSocket; PostgreSQL/PostGIS, Redis y NATS para datos y eventos; PMTiles en object storage/CDN; Docker Compose local y Kubernetes administrado cuando la carga lo justifique.**

NestJS se elige porque reduce el riesgo del equipo al mantener TypeScript y una estructura clara. Si las pruebas muestran que el gateway WebSocket no alcanza los objetivos aun despues de optimizar y escalar horizontalmente, se podra reemplazar solo ese despliegue por Go sin reescribir el dominio completo.
