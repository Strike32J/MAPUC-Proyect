import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { cargarEntorno } from '../../../libs/config';
import { RealtimeModule } from './realtime.module';
import { AdaptadorWsMapuc } from './bootstrap/configurar-ws';

async function bootstrap(): Promise<void> {
  const entorno = cargarEntorno();
  const app = await NestFactory.create<NestFastifyApplication>(
    RealtimeModule,
    new FastifyAdapter({ bodyLimit: 1024, logger: true }),
  );
  app.useWebSocketAdapter(new AdaptadorWsMapuc(app));
  app.enableShutdownHooks();
  await app.listen({ host: '0.0.0.0', port: entorno.REALTIME_PORT });
}

void bootstrap();
