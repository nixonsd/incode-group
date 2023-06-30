import { Observable, map } from 'rxjs';
import { instanceToPlain } from 'class-transformer';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Record<string, unknown>> {
    return next
      .handle()
      .pipe(map(data => instanceToPlain(data)));
  }
}
