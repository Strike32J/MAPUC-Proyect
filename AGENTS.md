# AGENTS.md

## Alcance

Estas instrucciones aplican a todo el repositorio MAPUC. Un archivo `AGENTS.md` ubicado en una subcarpeta puede agregar reglas mas especificas, pero no puede debilitar requisitos de seguridad, privacidad, accesibilidad o arquitectura establecidos aqui.

## Contexto del producto

MAPUC es una plataforma web de mapa y orientacion para el campus PUCP. Permite:

- autenticacion y perfiles;
- busqueda y filtros de lugares;
- mapas exteriores e interiores;
- rutas peatonales y accesibles;
- visualizacion de aforo;
- chat temporal cuando un lugar tiene alta afluencia, esta lleno o presenta una incidencia;
- reportes comunitarios y alertas validadas;
- lugares guardados, actividad reciente y notificaciones;
- administracion de lugares, mapas, aforo, reportes, alertas y moderacion.

La primera version es web. El backend debe mantener contratos reutilizables por una futura aplicacion Flutter.

## Documentos obligatorios

Antes de modificar arquitectura, dependencias, estructura o datos, leer:

1. `README.md`
2. `docs/ARQUITECTURA.md`
3. `docs/PATRONES-DE-DISENO.md`
4. `docs/STACK-TECNOLOGICO.md`
5. `docs/ESTRUCTURA-DE-CARPETAS.md`
6. `docs/BASE-DE-DATOS.md`

Si el repositorio aun conserva estos archivos en la raiz durante la etapa de planificacion, usar la version disponible y moverlos a `docs/` cuando se inicialice el proyecto.

## Arquitectura que se debe respetar

- Sistema cliente-servidor distribuido.
- Backend en NestJS con Fastify.
- NestJS monorepo con `api`, `realtime` y `workers`.
- Modulos de dominio con arquitectura hexagonal.
- PostgreSQL + PostGIS como fuente persistente.
- Redis solo para cache, presencia, rate limits e idempotencia temporal.
- NATS JetStream para eventos entre procesos.
- Transactional Outbox para eventos que no se pueden perder.
- Frontend React organizado por funcionalidades y flujo unidireccional.
- MapLibre consume PMTiles/MVT desde CDN; no se sirven CAD o grandes GeoJSON desde la API.

No introducir microservicios, CQRS completo, Event Sourcing, otra base de datos, otro broker o un segundo framework backend sin una ADR aprobada y evidencia tecnica.

## Limites entre capas del backend

### Dominio

- No importar NestJS, TypeORM, Fastify, Redis, NATS ni DTO HTTP.
- Mantener entidades, value objects, reglas y eventos de dominio.
- No acceder a reloj, UUID, red o almacenamiento global directamente; usar puertos cuando afecte pruebas o determinismo.

### Aplicacion

- Implementar casos de uso.
- Depender de interfaces/puertos.
- Controlar autorizacion de negocio, transacciones e idempotencia.
- No devolver respuestas HTTP ni codigos de estado.

### Infraestructura

- Implementar repositorios y adaptadores.
- Encapsular TypeORM, SQL espacial, Redis, NATS, Keycloak y storage.
- Usar consultas parametrizadas.
- Convertir modelos de persistencia a dominio mediante mappers.

### Presentacion

- Controladores y gateways validan el transporte y llaman casos de uso.
- No contienen reglas de negocio ni consultas TypeORM.
- Los DTO HTTP, mensajes WebSocket y eventos son contratos diferentes.

## Reglas entre modulos

- Importar solo la API publica exportada por `index.ts`.
- No acceder a `infrastructure/` de otro modulo.
- No modificar tablas de otro modulo desde un repositorio ajeno.
- Preferir un caso de uso publico para interacciones sincronas.
- Preferir eventos para reacciones asincronas.
- Evitar dependencias circulares; no usar `forwardRef` como solucion predeterminada.

## Reglas del frontend

- Organizar codigo de negocio en `src/features/<funcionalidad>`.
- Mantener componentes genericos en `src/components/ui`.
- Usar TanStack Query para estado remoto.
- Usar Zustand solo para estado compartido de interfaz; no duplicar respuestas de la API.
- Mantener efectos y acceso HTTP fuera de componentes de presentacion.
- Validar datos externos antes de usarlos.
- Encapsular MapLibre en `src/maps` y en la funcionalidad `mapa`.
- No escribir textos visibles en ingles; la interfaz es español latino.
- No depender solo del color para aforo, severidad o estados.

## Contratos

- La API publica se versiona bajo `/api/v1`.
- Todo endpoint publico debe aparecer en OpenAPI.
- Los eventos incluyen nombre, version, identificador, fecha y correlation ID.
- Los cambios incompatibles crean una nueva version.
- No editar manualmente clientes o tipos generados.
- WebSocket debe documentar eventos cliente-servidor y servidor-cliente.
- Los nombres internos pueden estar en español segun las convenciones del proyecto; identificadores tecnicos no usan tildes ni `ñ`.

## Base de datos

- Usar migraciones; no depender de `synchronize: true` fuera de pruebas desechables.
- Tablas y columnas en `snake_case` español sin tildes ni `ñ`.
- UUID para entidades distribuidas; tipos pequenos para catalogos estables.
- Incluir `creado_en` y `actualizado_en` cuando el ciclo de vida lo requiera.
- Usar `timestamptz` para instantes.
- Crear indices GiST para geometria y revisar planes con `EXPLAIN ANALYZE` en consultas criticas.
- Evitar consultas N+1 y selecciones de columnas innecesarias.
- No almacenar contrasenas, tokens OIDC, secretos o archivos binarios grandes.
- Toda migracion destructiva requiere plan de respaldo, compatibilidad y rollback.

## Tiempo real y capacidad

- No emitir todos los eventos del campus a todos los usuarios.
- Suscribir por lugar, sala o zona visible.
- Mantener payloads pequenos y versionados.
- Aplicar limites de mensaje, backpressure, heartbeat y timeout.
- Compartir rate limits y presencia mediante Redis; nunca solo en memoria local.
- Diseñar reconexion con jitter para evitar tormentas.
- Medir conexiones activas, mensajes por segundo, memoria y latencia.
- No afirmar que se soportan 100 000 conexiones sin resultados de k6 en un ambiente representativo.

## Reglas del chat

- Maximo 300 caracteres por mensaje.
- Maximo 5 mensajes por minuto por usuario en la configuracion inicial.
- Mostrar como maximo los ultimos 100 mensajes al abrir una sala.
- La sala solo se habilita por alta afluencia, aforo lleno o incidencia activa.
- Validar tamaño y limites en el servidor, aunque el cliente tambien los muestre.
- No convertir el chat en red social: no seguidores, mensajes privados, perfiles publicos ni reacciones sin un requisito aprobado.
- Toda accion de moderacion debe ser auditable.

## Reportes y alertas

- Los reportes comunitarios no se publican automaticamente como alertas oficiales.
- Aplicar rate limiting e idempotencia al crear reportes.
- No confiar en MIME, extension o nombre de archivos aportados por el cliente.
- Validar tamaño, tipo, checksum y almacenamiento de evidencias.
- Las alertas deben tener fuente, severidad, periodo de vigencia y responsable.

## Seguridad y privacidad

- OIDC Authorization Code con PKCE para clientes publicos.
- Validar issuer, audience, firma y expiracion del token.
- Aplicar minimo privilegio mediante roles y permisos.
- No registrar tokens, contrasenas, evidencia sensible, ubicacion precisa innecesaria ni contenido privado en logs.
- Enmascarar o resumir IP cuando se conserve para abuso/auditoria, segun politica aprobada.
- Usar TLS y origenes CORS explicitamente permitidos.
- Guardar secretos fuera de Git.
- Tratar nombres, correo, ubicacion y actividad como datos personales.
- Consultar antes de introducir seguimiento adicional, biometria, camaras o retencion indefinida.

## Accesibilidad

- Objetivo minimo WCAG AA.
- Navegacion completa por teclado.
- Foco visible.
- Targets tactiles adecuados.
- Etiquetas accesibles para controles de mapa e iconos.
- Aforo y severidad con texto/icono, no solo color.
- Rutas accesibles como opcion de primera clase.
- Modales, drawers y bottom sheets con gestion correcta del foco.

## Comandos esperados

Confirmar los scripts reales en cada `package.json` antes de ejecutarlos. La configuracion inicial debe converger en:

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run test:e2e
npm run build
docker compose up -d
docker compose down
```

Para aplicaciones NestJS, proveer scripts separados:

```bash
npm run start:api:dev
npm run start:realtime:dev
npm run start:workers:dev
```

No inventar un comando en la documentacion si no existe en `package.json`; agregar primero el script o documentar la diferencia.

## Pruebas requeridas

Toda modificacion debe incluir el nivel de prueba apropiado:

- reglas puras: prueba unitaria;
- repositorios y SQL/PostGIS: integracion con dependencia real;
- controlador o gateway: contrato, autenticacion y errores;
- componentes web: comportamiento y accesibilidad;
- flujo critico: Playwright;
- cambio de tiempo real o rendimiento: escenario k6 cuando corresponda.

Casos minimos por funcionalidad:

- camino exitoso;
- entrada invalida;
- usuario no autenticado;
- permiso insuficiente;
- recurso inexistente;
- limite de tasa;
- reintento/idempotencia cuando aplique;
- dependencia no disponible.

## Proceso de cambio

1. Inspeccionar codigo y documentacion relacionada.
2. Declarar supuestos si falta informacion.
3. Realizar el cambio minimo coherente con la arquitectura.
4. Agregar o actualizar pruebas.
5. Ejecutar lint, typecheck y pruebas afectadas.
6. Actualizar OpenAPI, esquemas de eventos, migraciones y documentos cuando corresponda.
7. Resumir archivos modificados, validacion realizada y riesgos restantes.

## ADR obligatoria

Crear una Architecture Decision Record en `docs/adr/` cuando se proponga:

- cambiar framework, base de datos, broker, proveedor OIDC o motor de mapas;
- extraer un microservicio;
- agregar un nuevo almacén persistente;
- cambiar contratos publicos de forma incompatible;
- introducir seguimiento o retencion de datos personales;
- modificar el modelo de autorizacion;
- adoptar una dependencia critica que condicione varias capas.

Una ADR incluye contexto, opciones, decision, consecuencias, riesgos y plan de reversa.

## Acciones prohibidas

- Subir `.env`, llaves, tokens, certificados o dumps con datos reales.
- Desactivar pruebas o seguridad para hacer pasar CI.
- Usar `any` para ocultar errores de contrato sin justificacion.
- Ejecutar migraciones destructivas automaticamente en produccion.
- Servir archivos CAD o grandes GeoJSON por cada solicitud de usuario.
- Crear una conexion PostgreSQL por usuario conectado.
- Confiar en validaciones exclusivas del frontend.
- Mezclar cambios de formato masivos con una correccion funcional no relacionada.
- Reescribir modulos completos sin evidencia y sin conservar cambios del equipo.

## Criterio de finalizacion

Un cambio esta terminado cuando:

- cumple el requisito funcional;
- respeta los limites de arquitectura;
- maneja errores, autorizacion y limites;
- tiene pruebas relevantes;
- pasa lint, typecheck y build;
- actualiza contratos y documentacion;
- no expone secretos ni datos personales;
- incluye observabilidad suficiente para diagnosticar fallos en produccion.
