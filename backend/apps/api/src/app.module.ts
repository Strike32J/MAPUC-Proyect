import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  cargarEntorno,
  crearConfiguracionBaseDatos,
  validarEntorno,
} from '../../../libs/config';
import { LugaresModule } from '../../../libs/modules/lugares';
import { DisponibilidadController } from './disponibilidad.controller';
import { EstadoController } from './estado.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validarEntorno,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => crearConfiguracionBaseDatos(cargarEntorno()),
    }),
    LugaresModule,
  ],
  controllers: [EstadoController, DisponibilidadController],
})
export class ApiModule {}
