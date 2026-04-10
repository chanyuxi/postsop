import type { ExecutionContext } from '@nestjs/common'
import {
  createParamDecorator,
  InternalServerErrorException,
} from '@nestjs/common'
import type { Request } from 'express'
import get from 'lodash/get'

import type { NestedPath } from '@postsop/contracts/types'

import type { JwtPayload } from '@/modules/auth/interfaces/jwt-payload.interface'

type JwtPayloadPath = NestedPath<JwtPayload>

const authContextDecorator = createParamDecorator(
  (path: JwtPayloadPath | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>()

    if (!request.jwtPayload) {
      throw new InternalServerErrorException(
        'Unable to obtain JWT payload information, please ensure that your route is included in AuthGuard',
      )
    }

    if (!path) {
      return request.jwtPayload
    }

    return get(request.jwtPayload, path)
  },
)

/**
 * Do not use this decorator with `@Public` routes.
 */
export function AuthContext(path?: JwtPayloadPath): ParameterDecorator {
  return authContextDecorator(path)
}
