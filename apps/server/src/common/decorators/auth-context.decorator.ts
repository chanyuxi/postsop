import type { ExecutionContext } from '@nestjs/common'
import {
  createParamDecorator,
  InternalServerErrorException,
} from '@nestjs/common'
import type { Request } from 'express'
import get from 'lodash/get'

import type { NestedPath } from '@postsop/types'

import type { AuthContextPayload } from '@/modules/auth/interfaces/claims.interface'

type AuthContextPath = NestedPath<AuthContextPayload>

const authContextDecorator = createParamDecorator(
  (path: AuthContextPath | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>()

    if (!request.authContext) {
      throw new InternalServerErrorException(
        'Unable to obtain authentication context, please ensure that your route is included in AuthGuard',
      )
    }

    if (!path) {
      return request.authContext
    }

    return get(request.authContext, path)
  },
)

/**
 * Do not use this decorator with `@Public` routes.
 */
export function AuthContext(path?: AuthContextPath): ParameterDecorator {
  return authContextDecorator(path)
}
