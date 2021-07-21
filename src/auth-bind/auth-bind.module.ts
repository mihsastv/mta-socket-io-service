import { Module } from '@nestjs/common';
import { AuthBindAmqpService } from './auth-bind.amqp.service';
import { AuthBindQueryService } from './auth-bind.query.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [AuthBindAmqpService, AuthBindQueryService],
})
export class AuthBindModule {}
