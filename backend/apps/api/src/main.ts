import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { cargarEntorno } from '../../../libs/config';
import { ApiModule } from './app.module';
import { crearAdaptadorFastify } from './bootstrap/configurar-fastify';
import { configurarOpenApi } from './bootstrap/configurar-openapi';
import { configurarSeguridad } from './bootstrap/configurar-seguridad';

async function bootstrap(): Promise<void> {
  const entorno = cargarEntorno();
  const app = await NestFactory.create<NestFastifyApplication>(
    ApiModule,
    crearAdaptadorFastify(),
  );
  await configurarSeguridad(app, entorno);
  configurarOpenApi(app);
  app.enableShutdownHooks();
  await app.listen({ host: '0.0.0.0', port: entorno.PORT });
}

void bootstrap();
