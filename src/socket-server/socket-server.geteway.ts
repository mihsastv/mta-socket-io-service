import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, OnModuleInit, UseGuards } from '@nestjs/common';
import { SocketServerGuard } from './socket-server.guard';
import { Socket, Server } from 'socket.io';
import { SocketServerQueryService } from './socket-server.query.service';

@UseGuards(SocketServerGuard)
@WebSocketGateway(8181, {
  namespace: 'vehicleMonitor',
  path: '/vehicleMonitor/socket.io',
})
export class EventsGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit
{
  private logger = new Logger(EventsGateway.name);
  private messageArr = [];
  private messageBind: { [id: string]: string } = {};

  constructor(private socketServerQueryService: SocketServerQueryService) {}

  onModuleInit() {
    this.parseArrayMessage().catch((e) => this.logger.error(e));
    this.checkDisconnect().catch((e) => this.logger.error(e));
  }

  @WebSocketServer()
  server: Server;

  @UseGuards(SocketServerGuard)
  @SubscribeMessage('login')
  onEvent(client: any): any {
    setTimeout(async () => {
      return this.socketServerQueryService.getClientAllowBind(client.id);
    }, 500);
  }

  addMessage(msg: any) {
    this.messageArr.push(msg);
  }

  async checkDisconnect() {
    const deviceDisconnect = await this.socketServerQueryService
      .getDeviceTimeout()
      .catch((e) => {
        this.logger.error(e);
        return null;
      });
    if (deviceDisconnect !== null) {
      for (const rec of deviceDisconnect) {
        this.emitNewMessage({
          event: this.messageBind[rec?.device_id],
          msg: {
            connectionState: 'disconnected',
            lastMessageTimestamp: rec.deviceId?.last_connection,
          },
        });
      }
    }
  }

  async parseArrayMessage() {
    while (this.messageArr.length > 0) {
      const msg = this.messageArr.pop();
      if (this.messageBind[msg?.device_id]) {
        this.emitNewMessage({ event: this.messageBind[msg?.device_id], msg });
      }
    }
    setTimeout(() => {
      this.parseArrayMessage();
    }, 1000);
  }

  emitNewMessage(p: { event: string; msg: any }) {
    this.server.emit(p.event, p.msg);
  }

  async emmitDisconnectMessage(deviceId: string) {
    console.log(deviceId);
    if (this.messageBind[deviceId]) {
      this.emitNewMessage({
        event: this.messageBind[deviceId],
        msg: {
          connectionState: 'disconnected',
          lastMessageTimestamp:
            await this.socketServerQueryService.getLastUnixtime(deviceId),
        },
      });
    }
  }

  afterInit(server: Server) {
    this.logger.log('Started Socket IO server');
  }

  handleDisconnect(client: Socket) {
    this.socketServerQueryService.delClientAllowBind(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    setTimeout(async () => {
      const checkClient =
        await this.socketServerQueryService.getClientAllowBind(client.id);
      if (!checkClient?.clientId) {
        this.logger.log(`Client ${client.id} not found bind`);
        client.disconnect();
      } else {
        this.logger.log(`Client ${client.id} found for bind`);
        this.messageBind[checkClient?.sim_id] = checkClient?.event_ident;
      }
    }, 10000);
    this.logger.log(`Client connected: ${client.id}`);
  }
}
