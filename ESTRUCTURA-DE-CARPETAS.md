# Estructura de carpetas de MAPUC

## 1. Estructura global

MAPUC se organiza como monorepo para coordinar frontend, backend, infraestructura, contratos y pruebas sin mezclar sus responsabilidades.

```text
mapuc/
├── backend/
├── frontend/
├── contracts/
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   ├── terraform/
│   └── observability/
├── scripts/
│   ├── development/
│   ├── database/
│   └── maps/
├── tests/
│   ├── e2e/
│   └── performance/
├── docs/
│   ├── ARQUITECTURA.md
│   ├── PATRONES-DE-DISENO.md
│   ├── STACK-TECNOLOGICO.md
│   ├── ESTRUCTURA-DE-CARPETAS.md
│   └── BASE-DE-DATOS.md
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── .editorconfig
├── .env.example
├── .gitignore
├── AGENTS.md
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

### Responsabilidad de las carpetas globales

| Carpeta | Contenido |
|---|---|
| `backend/` | API REST, gateway WebSocket, workers y modulos del dominio |
| `frontend/` | Aplicacion web React/PWA |
| `contracts/` | Esquemas OpenAPI, eventos versionados y tipos generados |
| `infrastructure/` | Despliegue, redes, observabilidad e infraestructura como codigo |
| `scripts/` | Automatizaciones repetibles; no reglas de negocio |
| `tests/` | Pruebas que cruzan proyectos y pruebas de carga |
| `docs/` | Decisiones y documentacion tecnica |

El proyecto mobile no se crea hasta que su desarrollo sea aprobado. Cuando exista, se agregara `mobile/` al nivel raiz y consumira `contracts/`.

## 2. Estructura interna del backend

NestJS se configura en modo monorepo con tres aplicaciones desplegables y librerias compartidas.

```text
backend/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   └── bootstrap/
│   │   │       ├── configurar-fastify.ts
│   │   │       ├── configurar-openapi.ts
│   │   │       └── configurar-seguridad.ts
│   │   └── test/
│   ├── realtime/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── realtime.module.ts
│   │   │   └── bootstrap/
│   │   └── test/
│   └── workers/
│       ├── src/
│       │   ├── main.ts
│       │   ├── workers.module.ts
│       │   └── consumers/
│       └── test/
├── libs/
│   ├── core/
│   │   ├── src/
│   │   │   ├── domain/
│   │   │   │   ├── entity.ts
│   │   │   │   ├── value-object.ts
│   │   │   │   └── domain-event.ts
│   │   │   ├── application/
│   │   │   │   ├── result.ts
│   │   │   │   ├── pagination.ts
│   │   │   │   └── clock.port.ts
│   │   │   └── errors/
│   │   └── index.ts
│   ├── config/
│   │   ├── src/
│   │   │   ├── environment.schema.ts
│   │   │   ├── database.config.ts
│   │   │   ├── redis.config.ts
│   │   │   └── nats.config.ts
│   │   └── index.ts
│   ├── observability/
│   ├── database/
│   │   ├── src/
│   │   │   ├── migrations/
│   │   │   ├── typeorm.config.ts
│   │   │   ├── transaction.ts
│   │   │   └── outbox/
│   │   └── index.ts
│   └── modules/
│       ├── identidad/
│       ├── campus/
│       ├── mapas/
│       ├── lugares/
│       ├── busqueda/
│       ├── rutas/
│       ├── aforo/
│       ├── chat/
│       ├── reportes/
│       ├── alertas/
│       ├── notificaciones/
│       ├── favoritos/
│       └── administracion/
├── test/
│   ├── integration/
│   ├── fixtures/
│   └── helpers/
├── .env.example
├── Dockerfile
├── eslint.config.js
├── jest.config.ts
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

## 3. Estructura de un modulo backend

Ejemplo para `libs/modules/lugares/`:

```text
lugares/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── lugar.entity.ts
│   │   ├── value-objects/
│   │   │   ├── capacidad.value-object.ts
│   │   │   └── horario.value-object.ts
│   │   ├── events/
│   │   │   └── lugar-actualizado.event.ts
│   │   └── services/
│   ├── application/
│   │   ├── use-cases/
│   │   │   ├── obtener-lugar.use-case.ts
│   │   │   ├── buscar-lugares.use-case.ts
│   │   │   └── actualizar-lugar.use-case.ts
│   │   ├── ports/
│   │   │   ├── repositorio-lugares.port.ts
│   │   │   └── lector-aforo.port.ts
│   │   └── dto/
│   ├── infrastructure/
│   │   ├── persistence/
│   │   │   ├── lugar.orm-entity.ts
│   │   │   ├── typeorm-lugares.repository.ts
│   │   │   └── lugar.mapper.ts
│   │   ├── cache/
│   │   └── messaging/
│   ├── presentation/
│   │   ├── http/
│   │   │   ├── lugares.controller.ts
│   │   │   ├── requests/
│   │   │   └── responses/
│   │   └── websocket/
│   ├── lugares.module.ts
│   └── index.ts
└── test/
    ├── unit/
    └── integration/
```

### Reglas del modulo

- Un controlador no accede directamente a TypeORM.
- Un caso de uso depende de puertos, no de adaptadores concretos.
- Una entidad de dominio no contiene decoradores de NestJS o TypeORM.
- `index.ts` publica solo la API que otros modulos pueden consumir.
- No se importa una ruta interna como `otro-modulo/src/infrastructure/...`.
- Los DTO HTTP no se reutilizan como eventos ni entidades de persistencia.

## 4. Estructura interna del frontend web

```text
frontend/
├── public/
│   ├── icons/
│   ├── manifest.webmanifest
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   ├── providers.tsx
│   │   ├── query-client.ts
│   │   └── guards/
│   ├── assets/
│   │   ├── images/
│   │   ├── logo/
│   │   └── fonts/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── feedback/
│   ├── features/
│   │   ├── auth/
│   │   ├── mapa/
│   │   ├── busqueda/
│   │   ├── lugares/
│   │   ├── rutas/
│   │   ├── aforo/
│   │   ├── chat/
│   │   ├── reportes/
│   │   ├── alertas/
│   │   ├── favoritos/
│   │   ├── perfil/
│   │   └── administracion/
│   ├── maps/
│   │   ├── maplibre/
│   │   ├── layers/
│   │   ├── markers/
│   │   ├── sources/
│   │   └── styles/
│   ├── pages/
│   │   ├── public/
│   │   ├── user/
│   │   └── admin/
│   ├── services/
│   │   ├── http/
│   │   ├── websocket/
│   │   ├── oidc/
│   │   └── telemetry/
│   ├── shared/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── constants/
│   │   └── utils/
│   ├── styles/
│   │   ├── globals.css
│   │   └── tokens.css
│   ├── test/
│   │   ├── setup.ts
│   │   ├── fixtures/
│   │   └── mocks/
│   ├── main.tsx
│   └── vite-env.d.ts
├── e2e/
├── .env.example
├── Dockerfile
├── eslint.config.js
├── index.html
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## 5. Estructura de una funcionalidad web

Ejemplo para `src/features/reportes/`:

```text
reportes/
├── api/
│   ├── reportes.api.ts
│   ├── reportes.queries.ts
│   └── reportes.schemas.ts
├── components/
│   ├── FormularioReporte.tsx
│   └── EstadoReporte.tsx
├── hooks/
│   └── useCrearReporte.ts
├── model/
│   ├── reporte.types.ts
│   ├── reporte.mappers.ts
│   └── reporte.machine.ts
├── pages/
│   └── ReportarIncidentePage.tsx
├── test/
│   ├── FormularioReporte.test.tsx
│   └── reportes.mappers.test.ts
└── index.ts
```

### Reglas del frontend

- `pages/` compone funcionalidades; no concentra todas las reglas.
- `components/ui/` contiene componentes genericos, no componentes de negocio.
- Cada `feature` expone su API publica mediante `index.ts`.
- Una funcionalidad no importa archivos internos de otra.
- TanStack Query mantiene estado remoto; Zustand no replica sus respuestas.
- Todo acceso HTTP pasa por `services/http` y los adaptadores de la funcionalidad.
- El mapa se modifica mediante capas y fuentes encapsuladas, no desde componentes arbitrarios.

## 6. Contratos compartidos

```text
contracts/
├── openapi/
│   └── mapuc-v1.yaml
├── events/
│   ├── aforo-actualizado.v1.json
│   ├── alerta-publicada.v1.json
│   └── mensaje-chat.v1.json
├── generated/
│   ├── typescript-web/
│   └── dart-mobile/
└── README.md
```

Los archivos generados no se editan a mano. Un cambio incompatible crea una nueva version del contrato.

## 7. Infraestructura

```text
infrastructure/
├── docker/
│   ├── api.Dockerfile
│   ├── realtime.Dockerfile
│   ├── workers.Dockerfile
│   └── frontend.Dockerfile
├── kubernetes/
│   ├── base/
│   └── overlays/
│       ├── staging/
│       └── production/
├── terraform/
│   ├── modules/
│   └── environments/
└── observability/
    ├── grafana/
    ├── prometheus/
    └── loki/
```

No se guardan secretos, archivos `.env` reales, certificados, dumps productivos ni credenciales dentro de estas carpetas.

## 8. Convenciones de nombres

- Carpetas y archivos TypeScript: `kebab-case`.
- Componentes React: `PascalCase.tsx`.
- Clases y tipos: `PascalCase`.
- Variables y funciones: `camelCase`.
- Tablas y columnas PostgreSQL: `snake_case` en español sin tildes ni `ñ`.
- Eventos: `<dominio>.<accion>` y version en el esquema.
- Pruebas: `*.spec.ts`, `*.test.tsx` o convencion definida por cada runner.
- Variables de entorno: `UPPER_SNAKE_CASE`.
