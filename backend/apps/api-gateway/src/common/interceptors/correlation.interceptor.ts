import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Observable } from 'rxjs';

@Injectable()
export class CorrelationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const correlationId =
      request.headers['x-correlation-id'] || randomUUID();

    request.correlationId = correlationId;

    const response = context.switchToHttp().getResponse();
    response.setHeader('x-correlation-id', correlationId);

    return next.handle();
  }
}
