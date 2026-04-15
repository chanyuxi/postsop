import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { Observable } from 'rxjs'
import { map } from 'rxjs'

import type { AnyApiEndpoint } from '@postsop/contracts/core'

import { AppException } from '@/common/exceptions/app.exception'

export class EndpointResponseValidationInterceptor implements NestInterceptor {
  constructor(private readonly endpoint: AnyApiEndpoint) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        const parsedResponse = this.endpoint.responseSchema.safeParse(data)

        if (!parsedResponse.success) {
          throw AppException.internal(
            `Response for ${this.endpoint.method} ${this.endpoint.path} does not match the endpoint contract`,
            parsedResponse.error,
          )
        }

        return parsedResponse.data
      }),
    )
  }
}
