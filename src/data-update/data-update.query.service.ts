import { Inject, Injectable, Logger } from '@nestjs/common';
import { PgClient } from '../shared/connectors/pg-connector/pg-connector.factory';
import { OtherPacketDto } from './dto/data-update.dto';

@Injectable()
export class DataUpdateQueryService {
  private logger = new Logger(DataUpdateQueryService.name);
  @Inject('PG_MAIN') private pgClient: PgClient;

  updateDeviceConnectionLog(params: OtherPacketDto): void {
    this.pgClient
      .query(
        `
        insert into device_log_connection (device_id, last_connection)
        values ('${params.deviceId}', ${params.getPacketUnixTime})
        on conflict
            (device_id) do update set last_connection = ${params.getPacketUnixTime}`,
      )
      .catch((e) => this.logger.error(e));
  }
}
