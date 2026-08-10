import { FastifyAdapter } from '@nestjs/platform-fastify';

export function crearAdaptadorFastify(): FastifyAdapter {
  return new FastifyAdapter({
    bodyLimit: 1_048_576,
    connectionTimeout: 10_000,
    requestTimeout: 30_000,
    logger: true,
    trustProxy: true,
  });
}
