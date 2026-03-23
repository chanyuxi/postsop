import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { catchError, map, Observable, of, throwError } from 'rxjs'

import { BaseBizException } from '../exceptions/base.biz.exception'
import { ResponseBuilder } from '../utils/response-builder.util'

@Injectable()
export class ResponseEncapsulationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        return ResponseBuilder.success(data)
      }),
      catchError((error: unknown) => {
        if (error instanceof BaseBizException) {
          return of(ResponseBuilder.failure(error.message))
        }
        return throwError(() => error)
      }),
    )
  }
}
