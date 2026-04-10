import {
  HTTP_MESSAGE_MAP,
  HttpStatus,
  RESPONSE_MESSAGE_MAP,
  ResponseStatus,
} from '@postsop/contracts/types'

export type ApiErrorType = 'network' | 'http' | 'business'

export class ApiError extends Error {
  readonly type: ApiErrorType

  constructor(
    message: string,
    public readonly httpStatus: number,
    public readonly responseStatus: number
  ) {
    super(message)
    this.name = 'ApiError'

    if (httpStatus <= 0) {
      this.type = 'network'
    } else if (
      responseStatus > 0 &&
      responseStatus !== ResponseStatus.SUCCESS
    ) {
      this.type = 'business'
    } else {
      this.type = 'http'
    }
  }

  get isNetworkError() {
    return this.httpStatus === HttpStatus.NETWORK_ERROR
  }

  get isTimeout() {
    return this.httpStatus === HttpStatus.TIMEOUT
  }

  get isUnauthorized() {
    return this.httpStatus === HttpStatus.UNAUTHORIZED
  }

  get isForbidden() {
    return this.httpStatus === HttpStatus.FORBIDDEN
  }

  get isNotFound() {
    return this.httpStatus === HttpStatus.NOT_FOUND
  }

  get isClientError() {
    return this.httpStatus >= 400 && this.httpStatus < 500
  }

  get isServerError() {
    return this.httpStatus >= 500
  }

  get isTokenExpired() {
    return this.responseStatus === ResponseStatus.TOKEN_EXPIRED
  }

  get isTokenInvalid() {
    return this.responseStatus === ResponseStatus.TOKEN_INVALID
  }

  get isPermissionDenied() {
    return this.responseStatus === ResponseStatus.PERMISSION_DENIED
  }

  get isRateLimited() {
    return this.responseStatus === ResponseStatus.RATE_LIMITED
  }

  get needsReLogin() {
    return this.isUnauthorized || this.isTokenExpired || this.isTokenInvalid
  }

  get displayMessage(): string {
    return (
      this.message ??
      RESPONSE_MESSAGE_MAP[this.responseStatus as ResponseStatus] ??
      HTTP_MESSAGE_MAP[this.httpStatus]
    )
  }

  static network(message = 'Network error') {
    return new ApiError(message, HttpStatus.NETWORK_ERROR, 0)
  }

  static timeout(message = 'Timeout') {
    return new ApiError(message, HttpStatus.TIMEOUT, 0)
  }

  static http(httpStatus: number, message?: string) {
    return new ApiError(
      message ?? HTTP_MESSAGE_MAP[httpStatus] ?? `HTTP Error ${httpStatus}`,
      httpStatus,
      0
    )
  }

  static business(responseStatus: number, message?: string) {
    return new ApiError(
      message ??
        RESPONSE_MESSAGE_MAP[responseStatus as ResponseStatus] ??
        'Business error',
      200,
      responseStatus
    )
  }
}
