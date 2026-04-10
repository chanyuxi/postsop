import { ResponseStatus } from '@postsop/contracts/type'

import type { Response } from '../interfaces/response.interface'

export class ResponseBuilder {
  static success<T = unknown>(data: T): Response<T> {
    return {
      code: ResponseStatus.SUCCESS,
      message: 'success',
      data,
    }
  }

  static failure(message: string): Response<null> {
    return {
      code: ResponseStatus.FAIL,
      message,
      data: null,
    }
  }
}
