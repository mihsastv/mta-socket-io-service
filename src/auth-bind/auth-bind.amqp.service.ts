import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuthBindQueryService } from './auth-bind.query.service';
import { AuthBindVehicleDto } from './dto/auth-bind-vehicle.dto';
import { validate } from 'class-validator';
import {
  MessageHandlerErrorBehavior,
  RabbitRPC,
} from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AuthBindAmqpService {
  logger = new Logger(AuthBindAmqpService.name);
  @Inject() private authBindQueryService: AuthBindQueryService;

  @RabbitRPC({
    allowNonJsonMessages: true,
    exchange: 'mta-tcp',
    routingKey: 'mta-tcp-bind-vehicles-message',
    queue: 'mta-tcp-bind-vehicles-message',
    errorBehavior: MessageHandlerErrorBehavior.NACK,
    queueOptions: {
      durable: true,
    },
  })
  public async subscribeNewRequestVehicleMessage(p: {
    sim_id: string;
    token: string;
  }): Promise<any> {
    this.logger.debug(p);
    const errors = await validate(new AuthBindVehicleDto(p));
    if (errors.length) {
      const errMsg =
        'Message Command validation error: ' + errors[0].toString();
      this.logger.error(errMsg);
      return errMsg;
    }

    let event_ident = '';
    const currBind = await this.authBindQueryService.getCurrentBind(p.sim_id);
    this.logger.debug(currBind);

    if (currBind !== null) {
      event_ident = currBind.event_ident;
      if (currBind?.tokens.indexOf(p.token) !== -1) {
        this.authBindQueryService
          .updateCurrentBind(p)
          .catch((e) => this.logger.error(e));
      } else {
        this.authBindQueryService
          .insertBind({ ...p, event_ident })
          .catch((e) => this.logger.error(e));
      }
    } else {
      event_ident = this.createRandomString();
      this.authBindQueryService
        .insertBind({ ...p, event_ident })
        .catch((e) => this.logger.error(e));
    }
    this.logger.debug({ event: event_ident, sim_id: p.sim_id });
    return { event: event_ident, sim_id: p.sim_id };
  }

  createRandomString(randomString = '') {
    const permittedChars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let x = 1; x < 10; ++x) {
      const randomNumber = Math.floor(1 + Math.random() * 60);
      randomString += permittedChars.slice(randomNumber - 1, randomNumber);
    }
    randomString += Date.now().toString();
    return randomString;
  }
}
