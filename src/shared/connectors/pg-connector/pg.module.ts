import { PG_CONNECTOR_FACTORY } from './pg-connector.factory';
import {
    DynamicModule,
    Global,
    Module,
} from '@nestjs/common';

@Global()
@Module({})
export class PgModule {
    static register(connectOptions: string[]): DynamicModule {
        return {
            module: PgModule,
            providers: [
                ...connectOptions.map(connect => PG_CONNECTOR_FACTORY(connect)),
            ],
            exports: [
                ...connectOptions,
            ],
        };
    }
}
