import {
    AmqpConnection,
    RabbitMQConfig,
} from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export const AMQP_CONNECTION_SERVICE_FACTORY = {
    provide: AmqpConnection,
    useFactory: async (configService: ConfigService) => {
        const amqpConfig: RabbitMQConfig = configService.get('amqp');
        Logger.debug(JSON.stringify(amqpConfig), 'amqpConfig');

        const amqpConnection = new AmqpConnection(amqpConfig);
        Logger.verbose('AMQP Init...', 'Amqp_Connection');

        await amqpConnection.init().catch((error) => {
            Logger.error('connection fail', error, 'RABBIT MQ Connection factory');
        });

        Logger.verbose('AMQP Init done.', 'Amqp_Connection');
        return amqpConnection;
    },
    inject: [ ConfigService ],
};

export const AMQP_CONNECTION_FACTORY = {
    useFactory: async (configService: ConfigService): Promise<RabbitMQConfig> => {
        const amqpConfig: RabbitMQConfig = configService.get('amqp');
        Logger.verbose({ AMQP_CONNECTION_FACTORY: amqpConfig }, 'AMQP_CONNECTION_FACTORY');
        return amqpConfig;
    },
    inject: [ ConfigService ],
};
