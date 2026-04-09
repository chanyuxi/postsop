import { type ApiErrorType, BizStatus, HttpStatus } from '@/types/api'

const HTTP_MESSAGE_MAP: Partial<Record<number, string>> = {
  [HttpStatus.BAD_REQUEST]: 'Bad request',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatus.FORBIDDEN]: 'Forbidden',
  [HttpStatus.NOT_FOUND]: 'Not found',
  [HttpStatus.METHOD_NOT_ALLOWED]: 'Method not allowed',
  [HttpStatus.CONFLICT]: 'Conflict',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable entity',
  [HttpStatus.TOO_MANY_REQUESTS]: 'Too many requests',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [HttpStatus.BAD_GATEWAY]: 'Bad gateway',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Service unavailable',
  [HttpStatus.GATEWAY_TIMEOUT]: 'Gateway timeout',
  [HttpStatus.NETWORK_ERROR]: 'Network error',
  [HttpStatus.TIMEOUT]: 'Timeout',
}

const BIZ_MESSAGE_MAP: Partial<Record<BizStatus, string>> = {
  [BizStatus.TOKEN_EXPIRED]: 'Token expired',
  [BizStatus.TOKEN_INVALID]: 'Token invalid',
  [BizStatus.PERMISSION_DENIED]: 'Permission denied',
  [BizStatus.PARAM_INVALID]: 'Parameter invalid',
  [BizStatus.RESOURCE_NOT_FOUND]: 'Resource not found',
  [BizStatus.RESOURCE_ALREADY_EXISTS]: 'Resource already exists',
  [BizStatus.RATE_LIMITED]: 'Rate limited',
  [BizStatus.ACCOUNT_LOCKED]: 'Account locked',
}

export class ApiError extends Error {
  readonly type: ApiErrorType

  constructor(
    message: string,
    public readonly httpStatus: number,
    public readonly bizStatus: number
  ) {
    super(message)
    this.name = 'ApiError'

    if (httpStatus <= 0) {
      this.type = 'network'
    } else if (bizStatus > 0 && bizStatus !== BizStatus.SUCCESS) {
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
    return this.bizStatus === BizStatus.TOKEN_EXPIRED
  }

  get isTokenInvalid() {
    return this.bizStatus === BizStatus.TOKEN_INVALID
  }

  get isPermissionDenied() {
    return this.bizStatus === BizStatus.PERMISSION_DENIED
  }

  get isRateLimited() {
    return this.bizStatus === BizStatus.RATE_LIMITED
  }

  get needsReLogin() {
    return this.isUnauthorized || this.isTokenExpired || this.isTokenInvalid
  }

  get displayMessage(): string {
    return (
      BIZ_MESSAGE_MAP[this.bizStatus as BizStatus] ??
      HTTP_MESSAGE_MAP[this.httpStatus] ??
      this.message
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

  static business(bizStatus: number, message?: string) {
    return new ApiError(
      message ?? BIZ_MESSAGE_MAP[bizStatus as BizStatus] ?? 'Business error',
      200,
      bizStatus
    )
  }
}
