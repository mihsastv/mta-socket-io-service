import { Inject, Injectable, Logger } from '@nestjs/common';
import { PgClient } from '../shared/connectors/pg-connector/pg-connector.factory';

@Injectable()
export class SocketServerQueryService {
  private logger = new Logger(SocketServerQueryService.name);
  @Inject('PG_MAIN') private pgClient: PgClient;

  async getCurrentBind(token: string, event: string, clientId) {
    const result = await this.pgClient.row<{ sim_id: string }>(
      `select sim_id from mta_subscribe_vehicle 
        where token = '${token}' and event_ident = '${event}' 
          and expire_date > ${Date.now() / 1000}::int`,
    );
    if (result?.sim_id) {
      this.updateCurrentBind(token, event, clientId, result.sim_id);
    }
  }

  getLastUnixtime(deviceId: string) {
    return this.pgClient.row(
      `select last_connection from device_log_connection where device_id = '${deviceId}'`,
    );
  }

  getDeviceTimeout() {
    return this.pgClient
      .rows(`select a.* from device_log_connection a, mta_subscribe_vehicle b
            where a. last_connection < extract(epoch  from now()) - 120
            and a.device_id = b.sim_id and b.client is not null and b.client <> ''`);
  }

  getClientAllowBind(
    clientId: string,
  ): Promise<{ clientId: string; sim_id: string; event_ident: string } | null> {
    return this.pgClient
      .row(`select client as "clientId", sim_id, event_ident from mta_subscribe_vehicle 
        where client = '${clientId}' and expire_date>${
      Date.now() / 1000
    }::int`);
  }

  delClientAllowBind(clientId: string) {
    this.pgClient
      .query(
        `update mta_subscribe_vehicle set client = ''
        where client = '${clientId}'`,
      )
      .catch((e) => this.logger.error(e));
  }

  updateCurrentBind(
    token: string,
    event: string,
    clientId: string,
    simId: string,
  ): void {
    this.pgClient
      .query(
        `update mta_subscribe_vehicle set 
        expire_date=${
          simId !== '89701010065008907121'
            ? Date.now() / 1000 + 3600
            : 1833860125
        }::int, client = '${clientId}'
        where token = '${token}' and event_ident = '${event}'`,
      )
      .catch((e) => this.logger.error(e));
  }

  getEvent(simId: string): Promise<any> {
    return this.pgClient.row(`select event_ident from mta_subscribe_vehicle 
        where sim_id = '${simId}' and expire_date > (extract(epoch from now())::int) and length(client)>0`);
  }
}
