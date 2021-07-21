import {
  ArgumentsHost,
  Global,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AMQP_CONNECTION_SERVICE_FACTORY } from './connectors/factory/amqp-connection.factory';
import { ClickhouseModule } from './connectors/clickhouse-connector/clickhouse.module';
import { PgModule } from './connectors/pg-connector/pg.module';

@Global()
@Module({
  imports: [
    PgModule,
    RabbitMQModule,
    ClickhouseModule.register(['CH_LOCAL']),
    PgModule.register(['PG_MAIN']),
  ],
  providers: [AMQP_CONNECTION_SERVICE_FACTORY],
  exports: [AmqpConnection],
})
export class SharedModule implements OnModuleInit {
  async onModuleInit() {
    Logger.verbose('The module has been initialized.', 'SharedModule');
  }

  catch(exception: any, host: ArgumentsHost) {
    Logger.debug({ exception, host }, 'CONNECTORS MODULE');
    Logger.error('Error Module', null, 'CONNECTORS MODULE');
  }
}
