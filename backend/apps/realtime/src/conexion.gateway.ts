import { WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway({ path: '/realtime' })
export class ConexionGateway {}
