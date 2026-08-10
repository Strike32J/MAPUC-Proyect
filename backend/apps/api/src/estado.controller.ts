import { Controller, Get } from '@nestjs/common';

@Controller('salud')
export class EstadoController {
  @Get()
  obtenerEstado(): { estado: string } {
    return { estado: 'disponible' };
  }
}
