import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type { Pagina } from '../../../../../core';
import type { CriteriosBusquedaLugares } from '../../application/dto/busqueda-lugares.dto';
import type { RepositorioLugares } from '../../application/ports/repositorio-lugares.port';
import { Lugar } from '../../domain/entities/lugar.entity';

interface FilaLugar {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  capacidad_estimada: number | null;
  accesible: boolean;
  actualizado_en: Date;
}

@Injectable()
export class TypeOrmLugaresRepository implements RepositorioLugares {
  constructor(@InjectDataSource() private readonly baseDatos: DataSource) {}

  async buscar(criterios: CriteriosBusquedaLugares): Promise<Pagina<Lugar>> {
    const filas = await this.baseDatos.query<FilaLugar[]>(
      `SELECT id, codigo, nombre, descripcion, capacidad_estimada, accesible, actualizado_en
       FROM lugares
       WHERE activo = TRUE
         AND ($1 = '' OR nombre ILIKE '%' || $1 || '%' OR codigo ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR codigo > $2)
       ORDER BY codigo ASC
       LIMIT $3`,
      [criterios.texto, criterios.cursor ?? null, criterios.limite + 1],
    );
    const tieneSiguiente = filas.length > criterios.limite;
    const elementos = filas
      .slice(0, criterios.limite)
      .map((fila) => this.aDominio(fila));
    const ultimo = elementos.at(-1);

    return {
      elementos,
      siguienteCursor: tieneSiguiente && ultimo ? ultimo.codigo : undefined,
    };
  }

  private aDominio(fila: FilaLugar): Lugar {
    return new Lugar(fila.id, {
      codigo: fila.codigo,
      nombre: fila.nombre,
      descripcion: fila.descripcion,
      capacidadEstimada: fila.capacidad_estimada,
      accesible: fila.accesible,
      actualizadoEn: fila.actualizado_en,
    });
  }
}
