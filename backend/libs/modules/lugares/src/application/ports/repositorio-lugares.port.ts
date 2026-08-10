import type { Pagina } from '../../../../../core';
import type { Lugar } from '../../domain/entities/lugar.entity';
import type { CriteriosBusquedaLugares } from '../dto/busqueda-lugares.dto';

export const REPOSITORIO_LUGARES = Symbol('REPOSITORIO_LUGARES');

export interface RepositorioLugares {
  buscar(criterios: CriteriosBusquedaLugares): Promise<Pagina<Lugar>>;
}
