import { Inject, Injectable, Logger } from '@nestjs/common';
import { PgClient } from '../shared/connectors/pg-connector/pg-connector.factory';
import {
  CurrentBindVehicleInterface,
  PersonBindVehicleInterface,
} from './auth-bind.interface';

@Injectable()
export class AuthBindQueryService {
  private logger = new Logger(AuthBindQueryService.name);
  @Inject('PG_MAIN') private pgClient: PgClient;

  async getCurrentBind(
    simId: string,
  ): Promise<CurrentBindVehicleInterface | null> {
    this.logger.debug(simId);
    return this.pgClient
      .row<CurrentBindVehicleInterface | null>(
        `
            select sim_id, event_ident, array_agg(token) as tokens from mta_subscribe_vehicle 
            where sim_id = '${simId}' and expire_date > extract(epoch from now()) group by sim_id, event_ident;
        `,
      )
      .catch((e) => {
        this.logger.error(e);
        return null;
      });
  }

  updateCurrentBind(p: PersonBindVehicleInterface): Promise<any> {
    return this.pgClient
      .query(`update mta_subscribe_vehicle set expire_date = (extract(epoch from now())::int + 3600)
        where sim_id = '${p.sim_id}' and token = '${p.token}' `);
  }

  insertBind(p: PersonBindVehicleInterface): Promise<any> {
    return this.pgClient
      .query(`insert into mta_subscribe_vehicle (sim_id, event_ident, token, expire_date) 
        values ('${p.sim_id}','${p.event_ident}','${p.token}', (extract(epoch from now())::int + 3600))`);
  }
}
