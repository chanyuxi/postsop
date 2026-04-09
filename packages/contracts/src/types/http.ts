/**
 * Enumerates HTTP response codes and client-side synthetic transport codes used
 * by the application to classify request failures.
 *
 * Positive values correspond to standard HTTP status codes returned by the
 * server or gateway. Non-positive values represent request failures that happen
 * before a valid HTTP response is received, such as network disconnects or
 * client-side timeouts.
 */
export enum HttpStatus {
  /** The request could not reach the server because of connectivity issues. */
  NETWORK_ERROR = 0,

  /** The request exceeded the configured client-side timeout window. */
  TIMEOUT = -1,

  /** The request payload, shape, or parameters were invalid. */
  BAD_REQUEST = 400,

  /** Authentication is missing, expired, or invalid. */
  UNAUTHORIZED = 401,

  /** The caller is authenticated but does not have permission to proceed. */
  FORBIDDEN = 403,

  /** The target resource could not be found. */
  NOT_FOUND = 404,

  /** The endpoint does not support the attempted HTTP method. */
  METHOD_NOT_ALLOWED = 405,

  /** The request conflicts with the current state of the resource. */
  CONFLICT = 409,

  /** The request is syntactically valid but fails semantic validation rules. */
  UNPROCESSABLE_ENTITY = 422,

  /** The caller exceeded the allowed request rate. */
  TOO_MANY_REQUESTS = 429,

  /** The server failed unexpectedly while processing the request. */
  INTERNAL_SERVER_ERROR = 500,

  /** The gateway received an invalid response from an upstream service. */
  BAD_GATEWAY = 502,

  /** The service is temporarily unavailable. */
  SERVICE_UNAVAILABLE = 503,

  /** The upstream service did not respond within the gateway timeout limit. */
  GATEWAY_TIMEOUT = 504,
}

/**
 * Enumerates business-level response statuses carried inside the unified API
 * response envelope.
 *
 * Unlike HTTP status codes, these values describe whether a request succeeded
 * from the perspective of domain logic. A request may still return HTTP 200
 * while `code` contains a non-success business status.
 */
export enum ResponseStatus {
  /** The request succeeded and the response payload is valid. */
  SUCCESS = 100000,

  /** A generic business failure when no more specific code applies. */
  FAIL = 100001,

  /** The access token is no longer valid because it has expired. */
  TOKEN_EXPIRED = 200001,

  /** The provided token is malformed, revoked, or otherwise invalid. */
  TOKEN_INVALID = 200002,

  /** The current user lacks the permissions required for the operation. */
  PERMISSION_DENIED = 200003,

  /** One or more request parameters failed backend validation rules. */
  PARAM_INVALID = 300001,

  /** The requested domain resource does not exist. */
  RESOURCE_NOT_FOUND = 300002,

  /** The target resource already exists and cannot be created again. */
  RESOURCE_ALREADY_EXISTS = 300003,

  /** The caller hit a business-level throttling rule. */
  RATE_LIMITED = 400001,

  /** The account is locked and cannot continue the requested operation. */
  ACCOUNT_LOCKED = 400002,
}

/**
 * Describes the standard backend response envelope shared by the client and
 * server.
 *
 * @typeParam T - The concrete payload type returned by a specific endpoint.
 */
export interface ApiResponse<T = unknown> {
  /** Business-level response status describing logical success or failure. */
  code: ResponseStatus

  /** Human-readable message suitable for logs, debugging, or fallback UI text. */
  message: string

  /** Endpoint-specific payload returned when the request completes. */
  data: T
}

/**
 * Provides fallback user-facing messages for transport-level failures.
 *
 * The map is intentionally partial because not every HTTP status needs a custom
 * default string. Callers may fall back to the server-provided message when a
 * status is not present here.
 */
export const HTTP_MESSAGE_MAP: Partial<Record<number, string>> = {
  /** Default message for malformed or invalid requests. */
  [HttpStatus.BAD_REQUEST]: 'Bad request',

  /** Default message for authentication failures. */
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized',

  /** Default message for authorization failures. */
  [HttpStatus.FORBIDDEN]: 'Forbidden',

  /** Default message for missing resources. */
  [HttpStatus.NOT_FOUND]: 'Not found',

  /** Default message for unsupported HTTP methods. */
  [HttpStatus.METHOD_NOT_ALLOWED]: 'Method not allowed',

  /** Default message for request conflicts. */
  [HttpStatus.CONFLICT]: 'Conflict',

  /** Default message for semantic validation failures. */
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable entity',

  /** Default message for rate limiting at the HTTP layer. */
  [HttpStatus.TOO_MANY_REQUESTS]: 'Too many requests',

  /** Default message for unexpected internal server failures. */
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal server error',

  /** Default message for upstream gateway failures. */
  [HttpStatus.BAD_GATEWAY]: 'Bad gateway',

  /** Default message for temporary service unavailability. */
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Service unavailable',

  /** Default message for upstream timeout failures. */
  [HttpStatus.GATEWAY_TIMEOUT]: 'Gateway timeout',

  /** Default message when no HTTP response is received because of network issues. */
  [HttpStatus.NETWORK_ERROR]: 'Network error',

  /** Default message when the client-side request times out. */
  [HttpStatus.TIMEOUT]: 'Timeout',
}

/**
 * Provides fallback user-facing messages for business-level response statuses.
 *
 * These messages are useful when the backend omits a more specific localized
 * message or when the client wants a consistent cross-platform fallback.
 */
export const RESPONSE_MESSAGE_MAP: Partial<Record<ResponseStatus, string>> = {
  /** Default message for expired tokens. */
  [ResponseStatus.TOKEN_EXPIRED]: 'Token expired',

  /** Default message for invalid tokens. */
  [ResponseStatus.TOKEN_INVALID]: 'Token invalid',

  /** Default message for insufficient permissions. */
  [ResponseStatus.PERMISSION_DENIED]: 'Permission denied',

  /** Default message for request parameter validation failures. */
  [ResponseStatus.PARAM_INVALID]: 'Parameter invalid',

  /** Default message for missing domain resources. */
  [ResponseStatus.RESOURCE_NOT_FOUND]: 'Resource not found',

  /** Default message for duplicate resource creation attempts. */
  [ResponseStatus.RESOURCE_ALREADY_EXISTS]: 'Resource already exists',

  /** Default message for business-level rate limiting. */
  [ResponseStatus.RATE_LIMITED]: 'Rate limited',

  /** Default message for locked accounts. */
  [ResponseStatus.ACCOUNT_LOCKED]: 'Account locked',
}
