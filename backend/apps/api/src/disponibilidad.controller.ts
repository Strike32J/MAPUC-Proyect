import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('listo')
export class DisponibilidadController {
  constructor(@InjectDataSource() private readonly baseDatos: DataSource) {}

  @Get()
  async verificar(): Promise<{ estado: string }> {
    try {
      await this.baseDatos.query('SELECT 1');
      return { estado: 'disponible' };
    } catch {
      throw new ServiceUnavailableException({ estado: 'no_disponible' });
    }
  }
}
