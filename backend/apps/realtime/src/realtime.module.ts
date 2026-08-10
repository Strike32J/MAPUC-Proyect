import { Module } from '@nestjs/common';
import { ConexionGateway } from './conexion.gateway';

@Module({ providers: [ConexionGateway] })
export class RealtimeModule {}
