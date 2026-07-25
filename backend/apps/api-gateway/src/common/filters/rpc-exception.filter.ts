import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

/** Maps gRPC status codes to HTTP status codes */
const GRPC_TO_HTTP: Record<number, number> = {
  0: HttpStatus.OK,                     // OK
  1: HttpStatus.INTERNAL_SERVER_ERROR,   // CANCELLED
  2: HttpStatus.INTERNAL_SERVER_ERROR,   // UNKNOWN
  3: HttpStatus.BAD_REQUEST,             // INVALID_ARGUMENT
  4: HttpStatus.GATEWAY_TIMEOUT,         // DEADLINE_EXCEEDED
  5: HttpStatus.NOT_FOUND,              // NOT_FOUND
  6: HttpStatus.CONFLICT,               // ALREADY_EXISTS
  7: HttpStatus.FORBIDDEN,              // PERMISSION_DENIED
  8: HttpStatus.TOO_MANY_REQUESTS,      // RESOURCE_EXHAUSTED
  9: HttpStatus.BAD_REQUEST,            // FAILED_PRECONDITION
  10: HttpStatus.CONFLICT,              // ABORTED
  11: HttpStatus.BAD_REQUEST,           // OUT_OF_RANGE
  12: HttpStatus.NOT_IMPLEMENTED,       // UNIMPLEMENTED
  13: HttpStatus.INTERNAL_SERVER_ERROR,  // INTERNAL
  14: HttpStatus.SERVICE_UNAVAILABLE,    // UNAVAILABLE
  15: HttpStatus.INTERNAL_SERVER_ERROR,  // DATA_LOSS
  16: HttpStatus.UNAUTHORIZED,          // UNAUTHENTICATED
};

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error = exception.getError();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (typeof error === 'string') {
      message = error;
      status = this.guessHttpStatus(error);
    } else if (typeof error === 'object' && error !== null) {
      const errObj = error as Record<string, any>;
      message = errObj.message || errObj.details || message;
      if (errObj.code !== undefined && GRPC_TO_HTTP[errObj.code] !== undefined) {
        status = GRPC_TO_HTTP[errObj.code];
      } else {
        status = this.guessHttpStatus(message);
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }

  private guessHttpStatus(message: string): number {
    const lower = message.toLowerCase();
    if (lower.includes('not found')) return HttpStatus.NOT_FOUND;
    if (lower.includes('already') || lower.includes('duplicate')) return HttpStatus.CONFLICT;
    if (lower.includes('unauthorized') || lower.includes('invalid credentials')) return HttpStatus.UNAUTHORIZED;
    if (lower.includes('forbidden') || lower.includes('permission')) return HttpStatus.FORBIDDEN;
    if (lower.includes('unavailable')) return HttpStatus.SERVICE_UNAVAILABLE;
    if (lower.includes('timeout') || lower.includes('deadline')) return HttpStatus.GATEWAY_TIMEOUT;
    if (lower.includes('invalid') || lower.includes('validation')) return HttpStatus.BAD_REQUEST;
    return HttpStatus.BAD_REQUEST;
  }
}
