import { z } from 'zod';

const esquemaEntorno = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  REALTIME_PORT: z.coerce.number().int().positive().default(3001),
  PUBLIC_APP_URL: z.string().url().default('http://localhost:5173'),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().url(),
  DATABASE_SSL: z.enum(['true', 'false']).default('false'),
  DATABASE_POOL_MIN: z.coerce.number().int().min(0).default(2),
  DATABASE_POOL_MAX: z.coerce.number().int().positive().default(20),
  REDIS_URL: z.string().url(),
  NATS_SERVERS: z.string().min(1),
  OIDC_ISSUER: z.string().url(),
  OIDC_AUDIENCE: z.string().min(1),
  OIDC_CLIENT_ID: z.string().min(1),
});

export type Entorno = z.infer<typeof esquemaEntorno>;

export function validarEntorno(
  configuracion: Record<string, unknown>,
): Entorno {
  return esquemaEntorno.parse(configuracion);
}

export function cargarEntorno(): Entorno {
  return validarEntorno(process.env);
}
