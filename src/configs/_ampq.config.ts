import { registerAs } from '@nestjs/config';
import {
  RabbitMQConfig,
  RabbitMQExchangeConfig,
} from '@golevelup/nestjs-rabbitmq';

export const AMQP_CONFIG_EXCHANGES: RabbitMQExchangeConfig[] = [
  {
    name: 'mta-tcp',
    type: 'direct',
  },
  {
    name: 'mta-tcp-data-packet',
    type: 'fanout',
  },
  {
    name: 'mta-tcp-other-packet',
    type: 'fanout',
  },
  {
    name: 'mta-tcp-connection-log',
    type: 'fanout',
  },
];
export const _amqpConfig = registerAs(
  'amqp',
  (): RabbitMQConfig => ({
    uri: [
      process.env.AMQP_URI,
      process.env.AMQP_URI2,
      process.env.AMQP_URI3,
    ].filter((amqpUrl) => !!amqpUrl),
    exchanges: AMQP_CONFIG_EXCHANGES,
    connectionInitOptions: { wait: true },
    connectionManagerOptions: {
      heartbeatIntervalInSeconds: 15,
      reconnectTimeInSeconds: 30,
    },
  }),
);
