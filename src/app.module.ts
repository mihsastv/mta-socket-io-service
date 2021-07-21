import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configs/configuration';
import { _amqpConfig } from './configs/_ampq.config';
import { _chConfig } from './configs/_ch.config';
import { _pgConfig } from './configs/_pg.config';
import { SharedModule } from './shared/shared.module';
import { SocketServerModule } from './socket-server/socket-server.module';
import { AuthBindModule } from './auth-bind/auth-bind.module';
import { DataUpdateModule } from './data-update/data-update.module';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({
      load: [
        configuration,
        _amqpConfig,
        _chConfig('CH_LOCAL', 'CLICKHOUSE_LOCAL_URL', 'CLICKHOUSE_LOCAL_DB'),
        _pgConfig('PG_MAIN', 'DATABASE_URL'),
      ],
      isGlobal: true,
    }),
    SocketServerModule,
    AuthBindModule,
    DataUpdateModule,
  ],
})
export class AppModule {}
