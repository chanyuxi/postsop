export declare enum HttpStatus {
    NETWORK_ERROR = 0,
    TIMEOUT = -1,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504
}
export declare enum BizCode {
    SUCCESS = 100000,
    FAIL = 100001,
    TOKEN_EXPIRED = 200001,
    TOKEN_INVALID = 200002,
    PERMISSION_DENIED = 200003,
    PARAM_INVALID = 300001,
    RESOURCE_NOT_FOUND = 300002,
    RESOURCE_ALREADY_EXISTS = 300003,
    RATE_LIMITED = 400001,
    ACCOUNT_LOCKED = 400002
}
export { BizCode as BizStatus };
export interface ApiResponse<T = unknown> {
    code: number;
    message: string;
    data: T | null;
}
