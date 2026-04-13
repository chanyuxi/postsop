import {
  INTERNAL_MESSAGE_MAP,
  InternalStatusCodes,
} from '@postsop/contracts/http'

import type { Response } from '../interfaces/response.interface'

export class ResponseBuilder {
  static success<T = unknown>(data: T): Response<T> {
    return {
      code: InternalStatusCodes.SUCCESS,
      message: INTERNAL_MESSAGE_MAP[InternalStatusCodes.SUCCESS],
      data,
    }
  }

  static failure(
    code: InternalStatusCodes,
    message = INTERNAL_MESSAGE_MAP[code],
  ): Response<null> {
    return {
      code,
      message,
      data: null,
    }
  }
}
