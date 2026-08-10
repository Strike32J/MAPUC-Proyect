import type { Entorno } from './environment.schema';

export function obtenerUrlRedis(entorno: Entorno): string {
  return entorno.REDIS_URL;
}
