import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { cargarEntorno, obtenerServidoresNats } from '../../../libs/config';
import { WorkersModule } from './workers.module';

async function bootstrap(): Promise<void> {
  const entorno = cargarEntorno();
  const app = await NestFactory.createMicroservice(WorkersModule, {
    transport: Transport.NATS,
    options: { servers: obtenerServidoresNats(entorno) },
  });
  await app.listen();
}

void bootstrap();
