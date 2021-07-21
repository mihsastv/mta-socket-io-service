import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SocketIoAdapter } from './shared/connectors/connection.socket-io-adapter';

async function bootstrap() {
  dotenv.config();
  const PORT = process.env.SERVER_PORT || 3434;
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.listen(PORT);
  Logger.verbose(`Server  started on ${PORT}`, 'MODULE');
}

bootstrap();
