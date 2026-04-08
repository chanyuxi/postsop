import { ResponseCode } from '@postsop/contracts/type'

import type { Response } from '../interfaces/response.interface'

export class ResponseBuilder {
  static success<T = unknown>(data: T): Response<T> {
    return {
      code: ResponseCode.SUCCESS,
      message: 'success',
      data,
    }
  }

  static failure<T = unknown>(message: string): Response<T> {
    return {
      code: ResponseCode.FAIL,
      message,
      data: null,
    }
  }
}
