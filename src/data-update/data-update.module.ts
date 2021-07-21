import { Module } from '@nestjs/common';
import { DataUpdateQueryService } from './data-update.query.service';
import { DataUpdateAmqpService } from './data-update.amqp.service';
import { SocketServerModule } from '../socket-server/socket-server.module';

@Module({
  imports: [SocketServerModule],
  providers: [DataUpdateQueryService, DataUpdateAmqpService],
})
export class DataUpdateModule {}
