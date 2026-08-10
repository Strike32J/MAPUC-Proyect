import type { Pagina } from '../../../../core';
import type { RepositorioLugares } from '../../src/application/ports/repositorio-lugares.port';
import { BuscarLugaresUseCase } from '../../src/application/use-cases/buscar-lugares.use-case';
import { Lugar } from '../../src/domain/entities/lugar.entity';

describe('BuscarLugaresUseCase', () => {
  it('normaliza el texto antes de delegar la busqueda al puerto', async () => {
    const resultado: Pagina<Lugar> = { elementos: [] };
    const buscar = jest.fn().mockResolvedValue(resultado);
    const repositorio: RepositorioLugares = { buscar };
    const casoDeUso = new BuscarLugaresUseCase(repositorio);

    await expect(
      casoDeUso.ejecutar({ texto: '  Biblioteca  ', limite: 20 }),
    ).resolves.toEqual(resultado);
    expect(buscar).toHaveBeenCalledWith({
      texto: 'Biblioteca',
      limite: 20,
    });
  });
});
