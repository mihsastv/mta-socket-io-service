import {
    Pool,
    PoolClient,
    PoolConfig,
} from 'pg';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    pgCallNamed,
    PgPropItem,
} from './pgCallNamed';

export interface PgProvider {
    provider: string,
    databaseConfig: string,
}

export const isDeadLockError = e => e?.code === '40P01' || e?.routine === 'DeadLockReport';

export class PgClient extends Pool {
    logger = new Logger(PgClient.name);
    client: PoolClient;
    ident = '';

    async init() {
        this.logger.verbose('Pg init...');
        this.client = await this.connect().catch(e => {
            this.logger.error('PG connect error', e);
            throw new Error('pg connect error');
        });
        this.logger.verbose('Pg Connected');
    }

    async sfRows<T = unknown>(storedFunction: string, fnProps: PgPropItem[]): Promise<T[] | null> {
        const fnArg = fnProps.map(prop => pgCallNamed(prop)).join(',');
        const query = `select *
                       from ${ storedFunction }(${ fnArg })`;
        return (await this.query<T>(query)).rows;
    }

    async sfRow<T = unknown>(storedFunction: string, fnProps: PgPropItem[]): Promise<T | null> {
        const fnArg = fnProps.map(prop => pgCallNamed(prop)).join(',');
        const query = `select *
                       from ${ storedFunction }(${ fnArg })`;
        return this.row<T>(query);
    }

    async row<T = unknown>(query: string): Promise<T | null> {
        const queryResult = await this.query(query);
        if (queryResult?.rows) {
            return queryResult.rows[0] ?? null;
        } else {
            throw new Error('Bad query. Empty result.');
        }
    }

    async rows<T = unknown>(query: string): Promise<Array<T> | []> {
        const queryResult = await this.query(query);
        if (queryResult?.rows) {
            return queryResult.rows ?? [];
        } else {
            throw new Error('Bad query. Empty result.');
        }
    }

    async fnValue<T = unknown>(query: string): Promise<T | null> {
        const rowItem = await this.row(`select ${ query } as field`);
        return rowItem['field'];
    }

    async fieldValue<T = unknown>(query: string, field: string): Promise<T | null> {
        return (await this.row<T>(query))?.[field] ?? null;
    }

    async close() {
        // TODO: find out: is Pool generates only one PoolClient?
        // await this.release(false);
        await this.end();
        this.logger.verbose(`Pg Connect ${ this.ident } closed`);
    }

    // async disconnect() {
    //     await this.client.end();
    // }
}

export const PG_CONNECTOR_FACTORY = (configIdent: string) => ({
    provide: configIdent,
    useFactory: async (configService: ConfigService): Promise<PgClient> => {
        const connectConfig: PoolConfig = configService.get(configIdent);
        if (!connectConfig?.connectionString) {
            throw new Error('connectionString is empty. ' + configIdent);
        }
        const pool = new PgClient(connectConfig);
        pool.ident = configIdent;
        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query('SELECT NOW() as now', (err, result) => {
                release();
                if (err) {
                    return console.error('Error executing query', err.stack);
                }
                Logger.verbose('Pg ' + configIdent + ' connected at: ' + result.rows[0]['now']);
            });
            return client;
        });
        // await connect.connect(
        //     //     (err, client, release) => {
        //     //     assert(client.release === release);
        //     // }
        // )
        //     // .finally()
        //     .catch(error => {
        //         Logger.error('PG connection error', error, 'PG Connector factory');
        //     });
        const dbURL = new URL(connectConfig.connectionString);
        Logger.verbose(`PG ${ configIdent } Connected at ${ dbURL.host }${ dbURL.pathname }`, 'PG_CONNECTOR factory');
        return pool ? pool : null;
    },
    inject: [ ConfigService ],
});
