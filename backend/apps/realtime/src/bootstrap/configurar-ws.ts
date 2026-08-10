import type { INestApplicationContext } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';

export class AdaptadorWsMapuc extends WsAdapter {
  constructor(app: INestApplicationContext) {
    super(app);
  }
}
