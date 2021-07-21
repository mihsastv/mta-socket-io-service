import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventsGateway } from '../socket-server/socket-server.geteway';
import { DataUpdateQueryService } from './data-update.query.service';
import {
  MessageHandlerErrorBehavior,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { DeviceDataInterface } from '../auth-bind/auth-bind.interface';
import { validate } from 'class-validator';
import { ConnManagePacketDto, OtherPacketDto } from './dto/data-update.dto';

@Injectable()
export class DataUpdateAmqpService {
  logger = new Logger(DataUpdateAmqpService.name);
  @Inject() private dataUpdateQueryService: DataUpdateQueryService;
  @Inject() private eventsGateway: EventsGateway;

  @RabbitSubscribe({
    allowNonJsonMessages: true,
    exchange: 'mta-tcp-data-packet',
    routingKey: 'data-packet-socket',
    queue: 'data-packet-socket',
    errorBehavior: MessageHandlerErrorBehavior.NACK,
    queueOptions: {
      durable: true,
    },
  })
  private async subscribeGetPacketData(data: DeviceDataInterface) {
    const msg = {
      mileage: data.data.data?.mileage,
      device_id: data.data.data?.device_id.toString(),
      ltd: data.data.data?.latitude,
      lng: data.data.data?.longitude,
      angle_direction: data.data.data?.angle_direction,
      speed: data.data.data?.speed,
      level_fuel_acp1: data.data.data?.level_fuel_acp1,
      ss_doorControl_driver: data.data.data?.sensorState.doorControlDriver,
      ss_doorControl_passenger:
        data.data.data?.sensorState.doorControlPassenger,
      ss_ignition: data.data.data?.sensorState.ignition,
      ss_hood_door_status: data.data.data?.sensorState.hoodDoorStatus,
      ss_trunk_door_status: data.data.data?.sensorState.trunkDoorStatus,
      ec_oil_pressure_level: data.data.data?.emergencyCodes.oilPressureLevel,
      ec_airbag: data.data.data?.emergencyCodes.airbag,
      ec_check_engine: data.data.data?.emergencyCodes.checkEngine,
      ec_lighting_error: data.data.data?.emergencyCodes.lightingError,
      ec_low_beam_headlights: data.data.data?.emergencyCodes.lowBeamHeadlights,
      ec_high_beam_headlights:
        data.data.data?.emergencyCodes.highBeamHeadlights,
      ec_conditioner_on: data.data.data?.emergencyCodes.conditionerOn,
      ssc_carClosed_factory_control_panel:
        data.data.data?.SecurityStateFlagCan.carClosedFactoryControlPanel,
      speed_engine: data.data.data?.speed_engine,
      gsm_level: data.data.data?.gsm_level,
      voltage_onboart: data.data.data?.voltage_onboart,
      satellites_number: data.data.data?.satellitesNumber,
      connectionState: 'connected',
      lastMessageTimestamp: data.data.data?.unixtime,
    };
    this.eventsGateway.addMessage(msg);
  }

  @RabbitSubscribe({
    allowNonJsonMessages: true,
    exchange: 'mta-tcp-other-packet',
    routingKey: 'other-packet-socket',
    queue: 'other-packet-socket',
    errorBehavior: MessageHandlerErrorBehavior.NACK,
    queueOptions: {
      durable: true,
    },
  })
  private async subscribeGetOtherPacket(params: OtherPacketDto) {
    this.logger.verbose(params);
    const errors = await validate(new OtherPacketDto(params));
    if (errors.length) {
      const errMsg =
        'Message Command validation error: ' + errors[0].toString();
      this.logger.error(errMsg);
      return errMsg;
    }
    this.dataUpdateQueryService.updateDeviceConnectionLog(params);
  }

  @RabbitSubscribe({
    allowNonJsonMessages: true,
    exchange: 'mta-tcp-connection-log',
    routingKey: 'connection-log-socket',
    queue: 'connection-log-socket',
    errorBehavior: MessageHandlerErrorBehavior.NACK,
    queueOptions: {
      durable: true,
    },
  })
  private async subscribeGetPacketConnection(params: ConnManagePacketDto) {
    this.logger.verbose(params);
    const errors = await validate(new ConnManagePacketDto(params));
    if (errors.length) {
      const errMsg =
        'Message Command validation error: ' + errors[0].toString();
      this.logger.error(errMsg);
      return errMsg;
    }
    if (params.connectionType === 'disconnect') {
      await this.eventsGateway.emmitDisconnectMessage(params.deviceId);
    }
  }
}
