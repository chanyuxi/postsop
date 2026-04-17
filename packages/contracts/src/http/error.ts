import {
  ApiErrorType,
  Codes,
  getCodeReasonPhrase,
  getReasonPhrase,
  NetworkStatusCodes,
  StatusCodes,
} from './definition'

export type HttpStatus = NetworkStatusCodes | StatusCodes

/**
 * Unified API error wrapper.
 */
export class ApiError extends Error {
  readonly type: ApiErrorType

  constructor(
    message: string,
    public readonly httpStatus: HttpStatus,
    public readonly code: Codes | null = null
  ) {
    super(message)

    if (httpStatus <= 0) {
      this.type = ApiErrorType.Network
    } else if (
      httpStatus === StatusCodes.OK &&
      code !== null &&
      code !== Codes.SUCCESS
    ) {
      this.type = ApiErrorType.Internal
    } else {
      this.type = ApiErrorType.Http
    }
  }

  get isNetworkError() {
    return this.httpStatus === NetworkStatusCodes.NETWORK_ERROR
  }

  get isTimeout() {
    return this.httpStatus === NetworkStatusCodes.TIMEOUT
  }

  get isUnauthorized() {
    return this.httpStatus === StatusCodes.UNAUTHORIZED
  }

  get isForbidden() {
    return this.httpStatus === StatusCodes.FORBIDDEN
  }

  get isNotFound() {
    return this.httpStatus === StatusCodes.NOT_FOUND
  }

  get isClientError() {
    return this.httpStatus >= 400 && this.httpStatus < 500
  }

  get isServerError() {
    return this.httpStatus >= 500
  }

  get isTokenExpired() {
    return this.code === Codes.TOKEN_EXPIRED
  }

  get isTokenInvalid() {
    return this.code === Codes.TOKEN_INVALID
  }

  get isPermissionDenied() {
    return this.code === Codes.PERMISSION_DENIED
  }

  get needsRefresh() {
    return (this.isUnauthorized || this.isForbidden) && this.isTokenExpired
  }

  get displayMessage() {
    return (
      this.message ||
      (this.code && getCodeReasonPhrase(this.code)) ||
      getReasonPhrase(this.httpStatus)
    )
  }

  static network(message = 'Network error') {
    return new ApiError(message, NetworkStatusCodes.NETWORK_ERROR)
  }

  static timeout(message = 'Request timeout') {
    return new ApiError(message, NetworkStatusCodes.TIMEOUT)
  }

  static http(httpStatus: HttpStatus, message?: string) {
    return new ApiError(message ?? getReasonPhrase(httpStatus), httpStatus)
  }

  static code(code: Codes, message?: string) {
    return new ApiError(
      message ?? getCodeReasonPhrase(code),
      StatusCodes.OK,
      code
    )
  }
}
