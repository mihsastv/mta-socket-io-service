import { Module } from '@nestjs/common';
import { SocketServerService } from './socket-server.service';
import { SocketServerGuard } from './socket-server.guard';
import { EventsGateway } from './socket-server.geteway';
import { SocketServerQueryService } from './socket-server.query.service';

@Module({
  providers: [
    SocketServerService,
    SocketServerGuard,
    EventsGateway,
    SocketServerQueryService,
  ],
  exports: [EventsGateway],
})
export class SocketServerModule {}
