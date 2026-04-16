import { Codes, getCodeReasonPhrase } from '@postsop/contracts/http'

import type { Response } from '../interfaces/response.interface'

export class ResponseBuilder {
  static success<T = unknown>(data: T): Response<T> {
    return {
      code: Codes.SUCCESS,
      message: getCodeReasonPhrase(Codes.SUCCESS),
      data,
    }
  }

  static failure(
    code: Codes,
    message = getCodeReasonPhrase(code),
  ): Response<null> {
    return {
      code,
      message,
      data: null,
    }
  }
}
