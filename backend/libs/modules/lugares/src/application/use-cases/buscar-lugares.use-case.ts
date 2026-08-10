import type { Pagina } from '../../../../../core';
import type { Lugar } from '../../domain/entities/lugar.entity';
import type { CriteriosBusquedaLugares } from '../dto/busqueda-lugares.dto';
import type { RepositorioLugares } from '../ports/repositorio-lugares.port';

export class BuscarLugaresUseCase {
  constructor(private readonly repositorio: RepositorioLugares) {}

  ejecutar(criterios: CriteriosBusquedaLugares): Promise<Pagina<Lugar>> {
    return this.repositorio.buscar({
      ...criterios,
      texto: criterios.texto.trim(),
    });
  }
}
