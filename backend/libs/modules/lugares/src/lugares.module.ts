import { Module } from '@nestjs/common';
import { BuscarLugaresUseCase } from './application/use-cases/buscar-lugares.use-case';
import { REPOSITORIO_LUGARES } from './application/ports/repositorio-lugares.port';
import { TypeOrmLugaresRepository } from './infrastructure/persistence/typeorm-lugares.repository';
import { LugaresController } from './presentation/http/lugares.controller';

export const BUSCAR_LUGARES = Symbol('BUSCAR_LUGARES');

@Module({
  controllers: [LugaresController],
  providers: [
    TypeOrmLugaresRepository,
    {
      provide: REPOSITORIO_LUGARES,
      useExisting: TypeOrmLugaresRepository,
    },
    {
      provide: BUSCAR_LUGARES,
      useFactory: (repositorio: TypeOrmLugaresRepository) =>
        new BuscarLugaresUseCase(repositorio),
      inject: [REPOSITORIO_LUGARES],
    },
  ],
  exports: [BUSCAR_LUGARES],
})
export class LugaresModule {}
