import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { Lugar } from '../../../domain/entities/lugar.entity';

export class LugarResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  codigo: string;

  @ApiProperty()
  nombre: string;

  @ApiPropertyOptional({ nullable: true })
  descripcion: string | null;

  @ApiPropertyOptional({ nullable: true })
  capacidadEstimada: number | null;

  @ApiProperty()
  accesible: boolean;

  @ApiProperty()
  actualizadoEn: Date;

  static desdeDominio(lugar: Lugar): LugarResponse {
    return {
      id: lugar.id,
      codigo: lugar.codigo,
      nombre: lugar.nombre,
      descripcion: lugar.descripcion,
      capacidadEstimada: lugar.capacidadEstimada,
      accesible: lugar.accesible,
      actualizadoEn: lugar.actualizadoEn,
    };
  }
}

export class PaginaLugaresResponse {
  @ApiProperty({ type: [LugarResponse] })
  elementos: LugarResponse[];

  @ApiPropertyOptional()
  siguienteCursor?: string;
}
