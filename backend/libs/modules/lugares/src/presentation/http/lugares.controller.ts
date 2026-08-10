import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BuscarLugaresUseCase } from '../../application/use-cases/buscar-lugares.use-case';
import { BUSCAR_LUGARES } from '../../lugares.module';
import { BuscarLugaresRequest } from './requests/buscar-lugares.request';
import {
  LugarResponse,
  PaginaLugaresResponse,
} from './responses/lugar.response';

@ApiTags('lugares')
@Controller('lugares')
export class LugaresController {
  constructor(
    @Inject(BUSCAR_LUGARES)
    private readonly buscarLugares: BuscarLugaresUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: PaginaLugaresResponse })
  async buscar(
    @Query() consulta: BuscarLugaresRequest,
  ): Promise<PaginaLugaresResponse> {
    const pagina = await this.buscarLugares.ejecutar(consulta);
    return {
      elementos: pagina.elementos.map((lugar) =>
        LugarResponse.desdeDominio(lugar),
      ),
      siguienteCursor: pagina.siguienteCursor,
    };
  }
}
