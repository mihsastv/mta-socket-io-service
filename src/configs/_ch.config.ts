import {
    ConfigService,
    registerAs,
} from '@nestjs/config';
import { ClickhouseConfig } from '../shared/connectors/clickhouse-connector/clickhouse-connector.factory';


export const _chConfig = (configIdent: string, env: string, envDb: string) =>
    registerAs(configIdent, (): ClickhouseConfig => {
        const configService = new ConfigService();
        const connectionString = configService.get<string>(env);
        const connectionDbString = configService.get<string>(envDb);
        if (!connectionString) {
            throw new Error(`ENV: '${ env }' not found. Check '.env' file or server variables.`);
        }
        if (!connectionDbString) {
            throw new Error(`ENV: '${ envDb }' not found. Check '.env' file or server variables.`);
        }
        return {
            url: connectionString,
            // port: 8123,
            // debug: false,
            // basicAuth: null,
            // isUseGzip: false,
            // format: "json", // "json" || "csv" || "tsv"
            // raw: false,
            config: {
                // session_id                              : 'session_id if neeed',
                session_timeout                         : 60,
                output_format_json_quote_64bit_integers : 0,
                enable_http_compression                 : 0,
                database                                : connectionDbString,
            },
            //
            // // This object merge with request params (see request lib docs)
            // reqParams: {
            //     ...
            // }
        };
    },
    );
