import { randomUUID } from 'node:crypto';
import { ValidationPipe } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import type { Entorno } from '../../../../libs/config';

export async function configurarSeguridad(
  app: NestFastifyApplication,
  entorno: Entorno,
): Promise<void> {
  const origenes = entorno.CORS_ORIGINS.split(',').map((origen) =>
    origen.trim(),
  );

  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, {
    origin: origenes,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );
  app.setGlobalPrefix('api/v1');

  const servidor = app.getHttpAdapter().getInstance();
  servidor.addHook('onRequest', async (solicitud, respuesta) => {
    const recibido = solicitud.headers['x-correlation-id'];
    const correlationId =
      typeof recibido === 'string' && recibido.length <= 128
        ? recibido
        : randomUUID();
    respuesta.header('x-correlation-id', correlationId);
  });
}
