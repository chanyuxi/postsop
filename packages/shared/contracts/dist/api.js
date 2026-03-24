"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BizStatus = exports.BizCode = exports.HttpStatus = void 0;
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["NETWORK_ERROR"] = 0] = "NETWORK_ERROR";
    HttpStatus[HttpStatus["TIMEOUT"] = -1] = "TIMEOUT";
    HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatus[HttpStatus["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    HttpStatus[HttpStatus["CONFLICT"] = 409] = "CONFLICT";
    HttpStatus[HttpStatus["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    HttpStatus[HttpStatus["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HttpStatus[HttpStatus["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    HttpStatus[HttpStatus["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    HttpStatus[HttpStatus["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
})(HttpStatus || (exports.HttpStatus = HttpStatus = {}));
var BizCode;
(function (BizCode) {
    BizCode[BizCode["SUCCESS"] = 100000] = "SUCCESS";
    BizCode[BizCode["FAIL"] = 100001] = "FAIL";
    BizCode[BizCode["TOKEN_EXPIRED"] = 200001] = "TOKEN_EXPIRED";
    BizCode[BizCode["TOKEN_INVALID"] = 200002] = "TOKEN_INVALID";
    BizCode[BizCode["PERMISSION_DENIED"] = 200003] = "PERMISSION_DENIED";
    BizCode[BizCode["PARAM_INVALID"] = 300001] = "PARAM_INVALID";
    BizCode[BizCode["RESOURCE_NOT_FOUND"] = 300002] = "RESOURCE_NOT_FOUND";
    BizCode[BizCode["RESOURCE_ALREADY_EXISTS"] = 300003] = "RESOURCE_ALREADY_EXISTS";
    BizCode[BizCode["RATE_LIMITED"] = 400001] = "RATE_LIMITED";
    BizCode[BizCode["ACCOUNT_LOCKED"] = 400002] = "ACCOUNT_LOCKED";
})(BizCode || (exports.BizStatus = exports.BizCode = BizCode = {}));
//# sourceMappingURL=api.js.map