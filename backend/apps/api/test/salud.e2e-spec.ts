import { Controller, Get, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

@Controller('api/v1/salud')
class EstadoPruebasController {
  @Get()
  obtenerEstado(): { estado: string } {
    return { estado: 'disponible' };
  }
}

@Module({ controllers: [EstadoPruebasController] })
class ApiPruebasModule {}

describe('salud de la API (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await NestFactory.create<NestFastifyApplication>(
      ApiPruebasModule,
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('expone el endpoint versionado de salud', async () => {
    const respuesta = await app.inject({ method: 'GET', url: '/api/v1/salud' });

    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.json()).toEqual({ estado: 'disponible' });
  });
});
