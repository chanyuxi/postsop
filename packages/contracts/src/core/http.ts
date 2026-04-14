import { getReasonPhrase, StatusCodes } from 'http-status-codes'

/**
 * Represents supported client platforms.
 */
export enum ClientPlatform {
  /** Mobile application platform */
  App = 'app',
  /** Web browser platform */
  Web = 'web',
}

/**
 * High-level classification of API errors.
 */
export enum ApiErrorType {
  /** Network-related failures (no response received) */
  Network,
  /** HTTP protocol-level errors (4xx, 5xx) */
  Http,
  /** Business logic / application-specific errors */
  Internal,
}

/**
 * Custom network error codes (non-HTTP).
 */
export enum NetworkStatusCodes {
  /** Generic network failure */
  NETWORK_ERROR = -1,
  /** Request timeout */
  TIMEOUT = -2,
}

/**
 * Internal (business-level) status codes.
 * These codes represent application-specific outcomes beyond HTTP.
 *
 * Layered convention (recommended for large-scale systems):
 * - 100xxx - Authentication & Authorization
 * - 101xxx - Request Validation
 * - 102xxx - Resource
 * - 103xxx - Rate Limiting
 * - 105xxx - System / Infrastructure
 * - 106xxx - Business Logic
 */
export enum InternalStatusCodes {
  /** Successful operation */
  SUCCESS = 100000,

  /** Access token has expired */
  TOKEN_EXPIRED = 100001,
  /** Access token is invalid */
  TOKEN_INVALID = 100002,
  /** User does not have required permissions */
  PERMISSION_DENIED = 100003,
  /** User is not authenticated */
  UNAUTHORIZED = 100004,

  /** Request parameters are invalid */
  INVALID_PARAMS = 101000,
  /** Required parameters are missing */
  MISSING_PARAMS = 101001,
  /** Parameter format is incorrect */
  INVALID_FORMAT = 101002,

  /** Requested resource does not exist */
  RESOURCE_NOT_FOUND = 102000,
  /** Resource already exists */
  RESOURCE_ALREADY_EXISTS = 102001,

  /** Too many requests in a short period */
  TOO_MANY_REQUESTS = 103000,

  /** Unexpected internal server error */
  INTERNAL_ERROR = 105000,
  /** Service is temporarily unavailable */
  SERVICE_UNAVAILABLE = 105001,
  /** Downstream dependency failed */
  DEPENDENCY_FAILURE = 105002,

  /** Generic business operation failure */
  OPERATION_FAILED = 106000,
  /** Operation is not allowed in current state */
  STATE_INVALID = 106001,
}

type HttpStatus = NetworkStatusCodes | StatusCodes

/**
 * Standard API response structure.
 */
export interface ApiResponse<T = unknown> {
  code: InternalStatusCodes
  message: string
  data: T
}

/**
 * Default mapping from internal status codes to fallback messages.
 */
export const INTERNAL_MESSAGE_MAP: Record<InternalStatusCodes, string> = {
  [InternalStatusCodes.SUCCESS]: 'Success',
  [InternalStatusCodes.TOKEN_EXPIRED]: 'Token expired',
  [InternalStatusCodes.TOKEN_INVALID]: 'Token invalid',
  [InternalStatusCodes.PERMISSION_DENIED]: 'Permission denied',
  [InternalStatusCodes.UNAUTHORIZED]: 'Unauthorized',
  [InternalStatusCodes.INVALID_PARAMS]: 'Invalid parameters',
  [InternalStatusCodes.MISSING_PARAMS]: 'Missing required parameters',
  [InternalStatusCodes.INVALID_FORMAT]: 'Invalid data format',
  [InternalStatusCodes.RESOURCE_NOT_FOUND]: 'Resource not found',
  [InternalStatusCodes.RESOURCE_ALREADY_EXISTS]: 'Resource already exists',
  [InternalStatusCodes.TOO_MANY_REQUESTS]: 'Too many requests',
  [InternalStatusCodes.INTERNAL_ERROR]: 'Internal server error',
  [InternalStatusCodes.SERVICE_UNAVAILABLE]: 'Service unavailable',
  [InternalStatusCodes.DEPENDENCY_FAILURE]: 'Dependency service failure',
  [InternalStatusCodes.OPERATION_FAILED]: 'Operation failed',
  [InternalStatusCodes.STATE_INVALID]: 'Invalid state for operation',
}

/**
 * Unified API error wrapper.
 */
export class ApiError extends Error {
  readonly type: ApiErrorType

  constructor(
    message: string,
    public readonly httpStatus: HttpStatus,
    public readonly internalStatus: InternalStatusCodes | null = null
  ) {
    super(message)

    if (httpStatus <= 0) {
      this.type = ApiErrorType.Network
    } else if (
      httpStatus === StatusCodes.OK &&
      internalStatus !== null &&
      internalStatus !== InternalStatusCodes.SUCCESS
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
    return this.internalStatus === InternalStatusCodes.TOKEN_EXPIRED
  }

  get isTokenInvalid() {
    return this.internalStatus === InternalStatusCodes.TOKEN_INVALID
  }

  get isPermissionDenied() {
    return this.internalStatus === InternalStatusCodes.PERMISSION_DENIED
  }

  get needsRefresh() {
    return this.isForbidden && this.isTokenExpired
  }

  get displayMessage() {
    return (
      this.message ||
      (this.internalStatus && INTERNAL_MESSAGE_MAP[this.internalStatus]) ||
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

  static internal(internalStatus: InternalStatusCodes, message?: string) {
    return new ApiError(
      message ?? INTERNAL_MESSAGE_MAP[internalStatus],
      StatusCodes.OK,
      internalStatus
    )
  }
}
