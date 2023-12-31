import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

export interface Response<T> {
  result: T;
  statusCode: number;
  message?: string;
  error?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {

  /**
   * Makes API responses to have the same format for all endpoints
   * @param {ExecutionContext} context the current request pipeline
   * @param {CallHandler} next access to the response stream
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle()
      .pipe(map(result => {
        return ({
          result,
          statusCode: context.switchToHttp().getResponse().statusCode,
        });
      }));
  }
}
