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
  /** Failed to initiate request */
  CONFIG_ERROR = -3,
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
export enum Codes {
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
 * Standard API response structure.
 */
export interface ApiResponse<T = unknown> {
  code: Codes
  message: string
  data: T
}

const CODE_MESSAGE_MAP: Record<Codes, string> = {
  [Codes.SUCCESS]: 'Success',
  [Codes.TOKEN_EXPIRED]: 'Token expired',
  [Codes.TOKEN_INVALID]: 'Token invalid',
  [Codes.PERMISSION_DENIED]: 'Permission denied',
  [Codes.UNAUTHORIZED]: 'Unauthorized',
  [Codes.INVALID_PARAMS]: 'Invalid parameters',
  [Codes.MISSING_PARAMS]: 'Missing required parameters',
  [Codes.INVALID_FORMAT]: 'Invalid data format',
  [Codes.RESOURCE_NOT_FOUND]: 'Resource not found',
  [Codes.RESOURCE_ALREADY_EXISTS]: 'Resource already exists',
  [Codes.TOO_MANY_REQUESTS]: 'Too many requests',
  [Codes.INTERNAL_ERROR]: 'Internal server error',
  [Codes.SERVICE_UNAVAILABLE]: 'Service unavailable',
  [Codes.DEPENDENCY_FAILURE]: 'Dependency service failure',
  [Codes.OPERATION_FAILED]: 'Operation failed',
  [Codes.STATE_INVALID]: 'Invalid state for operation',
}

/**
 * Default mapping from internal status codes to fallback messages.
 */
export const getCodeReasonPhrase = (code: Codes) => CODE_MESSAGE_MAP[code]

export { getReasonPhrase, StatusCodes }
