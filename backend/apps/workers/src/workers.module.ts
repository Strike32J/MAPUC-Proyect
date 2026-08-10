import { Module } from '@nestjs/common';
import { EventosOutboxConsumer } from './consumers/eventos-outbox.consumer';

@Module({ controllers: [EventosOutboxConsumer] })
export class WorkersModule {}
