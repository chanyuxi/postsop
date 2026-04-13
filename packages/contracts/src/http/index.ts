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
 *
 * 注意这里的区别，如果 ApiErrorType 为 Internal Error，我们的判断标准是它必须通过了 HttpStatus.OK 的校验。
 * 而若为 Http Error，它可以携带 InternalStatusCodes，用于进一步的信息判断。
 * 至少我们总得为混合情况下定义出一种边界。
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

/**
 * Union type representing all possible HTTP-related statuses.
 */
type HttpStatus = NetworkStatusCodes | StatusCodes

/**
 * Standard API response structure.
 * @template T Type of the response payload
 */
export interface ApiResponse<T = unknown> {
  /** Internal business status code */
  code: InternalStatusCodes
  /** Human-readable message */
  message: string
  /** Response payload */
  data: T
}

/**
 * Default mapping from internal status codes to fallback messages.
 *
 * Notes:
 * - Used when API response does not provide a message.
 * - Should remain concise and user-friendly.
 * - Can be extended or replaced for i18n implementations.
 */
export const INTERNAL_MESSAGE_MAP: Record<InternalStatusCodes, string> = {
  /** Success */
  [InternalStatusCodes.SUCCESS]: 'Success',

  // 100xxx - Auth & Permission
  [InternalStatusCodes.TOKEN_EXPIRED]: 'Token expired',
  [InternalStatusCodes.TOKEN_INVALID]: 'Token invalid',
  [InternalStatusCodes.PERMISSION_DENIED]: 'Permission denied',
  [InternalStatusCodes.UNAUTHORIZED]: 'Unauthorized',

  // 101xxx - Request Validation
  [InternalStatusCodes.INVALID_PARAMS]: 'Invalid parameters',
  [InternalStatusCodes.MISSING_PARAMS]: 'Missing required parameters',
  [InternalStatusCodes.INVALID_FORMAT]: 'Invalid data format',

  // 102xxx - Resource
  [InternalStatusCodes.RESOURCE_NOT_FOUND]: 'Resource not found',
  [InternalStatusCodes.RESOURCE_ALREADY_EXISTS]: 'Resource already exists',

  // 103xxx - Rate Limiting
  [InternalStatusCodes.TOO_MANY_REQUESTS]: 'Too many requests',

  // 105xxx - System / Infrastructure
  [InternalStatusCodes.INTERNAL_ERROR]: 'Internal server error',
  [InternalStatusCodes.SERVICE_UNAVAILABLE]: 'Service unavailable',
  [InternalStatusCodes.DEPENDENCY_FAILURE]: 'Dependency service failure',

  // 106xxx - Business Logic
  [InternalStatusCodes.OPERATION_FAILED]: 'Operation failed',
  [InternalStatusCodes.STATE_INVALID]: 'Invalid state for operation',
}

/**
 * Unified API error wrapper.
 *
 * Combines:
 * - Network errors (no HTTP response)
 * - HTTP errors (status codes)
 * - Internal business errors
 */
export class ApiError extends Error {
  /** Categorized error type */
  readonly type: ApiErrorType

  /**
   * @param message Human-readable error message
   * @param httpStatus HTTP or network status code
   * @param internalStatus Optional business status code
   */
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

  /** Whether the request is network error */
  get isNetworkError() {
    return this.httpStatus === NetworkStatusCodes.NETWORK_ERROR
  }

  /** Whether the request is timeout */
  get isTimeout() {
    return this.httpStatus === NetworkStatusCodes.TIMEOUT
  }

  /** Whether the request is unauthorized (401) */
  get isUnauthorized() {
    return this.httpStatus === StatusCodes.UNAUTHORIZED
  }

  /** Whether access is forbidden (403) */
  get isForbidden() {
    return this.httpStatus === StatusCodes.FORBIDDEN
  }

  /** Whether resource is not found (404) */
  get isNotFound() {
    return this.httpStatus === StatusCodes.NOT_FOUND
  }

  /** Whether it is a client-side HTTP error (4xx) */
  get isClientError() {
    return this.httpStatus >= 400 && this.httpStatus < 500
  }

  /** Whether it is a server-side HTTP error (5xx) */
  get isServerError() {
    return this.httpStatus >= 500
  }

  /** Whether token is expired */
  get isTokenExpired() {
    return this.internalStatus === InternalStatusCodes.TOKEN_EXPIRED
  }

  /** Whether token is invalid */
  get isTokenInvalid() {
    return this.internalStatus === InternalStatusCodes.TOKEN_INVALID
  }

  /** Whether permission is denied */
  get isPermissionDenied() {
    return this.internalStatus === InternalStatusCodes.PERMISSION_DENIED
  }

  /** Whether request should trigger token refresh */
  get needsRefresh() {
    return this.isForbidden && this.isTokenExpired
  }

  /**
   * Returns the best available message for display:
   * Priority:
   * 1. Explicit message
   * 2. Internal status mapping
   * 3. HTTP reason phrase
   */
  get displayMessage() {
    return (
      this.message ||
      (this.internalStatus && INTERNAL_MESSAGE_MAP[this.internalStatus]) ||
      getReasonPhrase(this.httpStatus)
    )
  }

  /** Create a generic network error */
  static network(message = 'Network error') {
    return new ApiError(message, NetworkStatusCodes.NETWORK_ERROR)
  }

  /** Create a timeout error */
  static timeout(message = 'Request timeout') {
    return new ApiError(message, NetworkStatusCodes.TIMEOUT)
  }

  /** Create an HTTP error */
  static http(httpStatus: HttpStatus, message?: string) {
    return new ApiError(message ?? getReasonPhrase(httpStatus), httpStatus)
  }

  /**
   * Create an internal business error
   * @param internalStatus Business status code
   * @param message Optional override message
   * @param httpStatus Associated HTTP status (default 200)
   */
  static internal(internalStatus: InternalStatusCodes, message?: string) {
    return new ApiError(
      message ?? INTERNAL_MESSAGE_MAP[internalStatus],
      StatusCodes.OK,
      internalStatus
    )
  }
}
