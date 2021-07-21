import {CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Logger} from "@nestjs/common";
import {Observable} from "rxjs";
import {SocketServerQueryService} from "./socket-server.query.service";

@Injectable()
export class SocketServerGuard implements CanActivate {
    private logger = new Logger(SocketServerGuard.name)
    constructor(private socketServerQueryService: SocketServerQueryService) {
    }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToWs().getData();
        const client = context.switchToWs().getClient();
        this.socketServerQueryService.getCurrentBind(request?.token,
            request?.event, client?.id).catch(e => this.logger.error(e));
        return true;
    }
}

