import { BizCode } from '@postsop/shared-contracts'

import type { Response } from '../interfaces/response.interface'

export class ResponseBuilder {
  static success<T = unknown>(data: T): Response<T> {
    return {
      code: BizCode.SUCCESS,
      message: 'success',
      data,
    }
  }

  static failure<T = unknown>(message: string): Response<T> {
    return {
      code: BizCode.FAIL,
      message,
      data: null,
    }
  }
}
