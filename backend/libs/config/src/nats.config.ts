import type { Entorno } from './environment.schema';

export function obtenerServidoresNats(entorno: Entorno): string[] {
  return entorno.NATS_SERVERS.split(',').map((servidor) => servidor.trim());
}
