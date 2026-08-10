import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

interface EventoOutbox {
  id: string;
  nombre: string;
  version: number;
  correlationId: string;
  contenido: object;
}

@Controller()
export class EventosOutboxConsumer {
  private readonly logger = new Logger(EventosOutboxConsumer.name);

  @EventPattern('mapuc.outbox')
  procesar(@Payload() evento: EventoOutbox): void {
    this.logger.log({
      eventoId: evento.id,
      nombre: evento.nombre,
      version: evento.version,
      correlationId: evento.correlationId,
    });
  }
}
