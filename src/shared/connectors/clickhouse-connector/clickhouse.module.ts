
import {
    DynamicModule,
    Global,
    Module,
} from '@nestjs/common';
import { CH_CONNECTOR_FACTORY } from './clickhouse-connector.factory';

@Global()
@Module({})
export class ClickhouseModule {
    static register(connectOptions: string[]): DynamicModule {
        return {
            module: ClickhouseModule,
            providers: [
                ...connectOptions.map(connect => CH_CONNECTOR_FACTORY(connect)),
            ],
            exports: [
                ...connectOptions,
            ],
        };
    }
}
