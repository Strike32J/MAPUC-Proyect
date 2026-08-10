import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configurarOpenApi(app: NestFastifyApplication): void {
  const configuracion = new DocumentBuilder()
    .setTitle('MAPUC API')
    .setDescription('Contrato HTTP versionado de MAPUC.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const documento = SwaggerModule.createDocument(app, configuracion);
  SwaggerModule.setup('documentacion', app, documento);
}
