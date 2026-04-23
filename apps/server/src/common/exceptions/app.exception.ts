import { HttpException, HttpStatus } from '@nestjs/common'

import { Codes, getCodeReasonPhrase } from '@postsop/contracts/http'

interface AppExceptionOptions {
  cause?: unknown
  details?: unknown
  httpStatus: HttpStatus | number
  code: Codes
  message?: string
}

export class AppException extends HttpException {
  readonly details?: unknown
  readonly code: Codes

  constructor({
    cause,
    details,
    httpStatus,
    code,
    message,
  }: AppExceptionOptions) {
    if (code === Codes.SUCCESS) {
      throw new Error('AppException cannot use Codes.SUCCESS')
    }

    if (httpStatus >= HttpStatus.OK && httpStatus < 300) {
      throw new Error(
        `AppException cannot use successful HTTP status ${httpStatus} for failure code ${code}`,
      )
    }

    super(message ?? getCodeReasonPhrase(code), httpStatus, {
      cause,
    })

    this.details = details
    this.code = code
  }

  static invalidParams(message?: string, details?: unknown) {
    return new AppException({
      details,
      httpStatus: HttpStatus.BAD_REQUEST,
      code: Codes.INVALID_PARAMS,
      message,
    })
  }

  static unauthorized(message?: string) {
    return new AppException({
      httpStatus: HttpStatus.UNAUTHORIZED,
      code: Codes.UNAUTHORIZED,
      message,
    })
  }

  static tokenExpired(message?: string) {
    return new AppException({
      httpStatus: HttpStatus.UNAUTHORIZED,
      code: Codes.TOKEN_EXPIRED,
      message,
    })
  }

  static tokenInvalid(message?: string) {
    return new AppException({
      httpStatus: HttpStatus.UNAUTHORIZED,
      code: Codes.TOKEN_INVALID,
      message,
    })
  }

  static permissionDenied(message?: string) {
    return new AppException({
      httpStatus: HttpStatus.FORBIDDEN,
      code: Codes.PERMISSION_DENIED,
      message,
    })
  }

  static resourceAlreadyExists(message?: string) {
    return new AppException({
      httpStatus: HttpStatus.CONFLICT,
      code: Codes.RESOURCE_ALREADY_EXISTS,
      message,
    })
  }

  static internal(message?: string, details?: unknown) {
    return new AppException({
      details,
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      code: Codes.INTERNAL_ERROR,
      message,
    })
  }
}
