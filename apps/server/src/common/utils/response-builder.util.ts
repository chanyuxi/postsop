import {
  ApiResponse,
  Codes,
  getCodeReasonPhrase,
} from '@postsop/contracts/http'

export class ResponseBuilder {
  static success<T = unknown>(data: T): ApiResponse<T> {
    return {
      code: Codes.SUCCESS,
      message: getCodeReasonPhrase(Codes.SUCCESS),
      data,
    }
  }

  static failure(
    code: Codes,
    message = getCodeReasonPhrase(code),
  ): ApiResponse<null> {
    return {
      code,
      message,
      data: null,
    }
  }
}
