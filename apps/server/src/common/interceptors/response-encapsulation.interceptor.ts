import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'

import { ResponseBuilder } from '../utils/response-builder.util'

@Injectable()
export class ResponseEncapsulationInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        return ResponseBuilder.success(data)
      }),
    )
  }
}
