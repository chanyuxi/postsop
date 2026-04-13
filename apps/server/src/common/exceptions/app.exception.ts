import { HttpException, HttpStatus } from '@nestjs/common'

import {
  INTERNAL_MESSAGE_MAP,
  InternalStatusCodes,
} from '@postsop/contracts/http'

interface AppExceptionOptions {
  cause?: unknown
  details?: unknown
  httpStatus: HttpStatus | number
  internalCode: InternalStatusCodes
  message?: string
}

export class AppException extends HttpException {
  readonly details?: unknown
  readonly internalCode: InternalStatusCodes

  constructor({
    cause,
    details,
    httpStatus,
    internalCode,
    message,
  }: AppExceptionOptions) {
    super(message ?? INTERNAL_MESSAGE_MAP[internalCode], httpStatus, {
      cause,
    })

    this.details = details
    this.internalCode = internalCode
  }

  static invalidParams(message?: string, details?: unknown) {
    return new AppException({
      details,
      httpStatus: HttpStatus.BAD_REQUEST,
      internalCode: InternalStatusCodes.INVALID_PARAMS,
      message,
    })
  }

  static unauthorized(message?: string) {
    return new AppException({
      httpStatus: HttpStatus.UNAUTHORIZED,
      internalCode: InternalStatusCodes.UNAUTHORIZED,
      message,
    })
  }

  static tokenExpired(message?: string) {
    return new AppException({
      httpStatus: HttpStatus.FORBIDDEN,
      internalCode: InternalStatusCodes.TOKEN_EXPIRED,
      message,
    })
  }

  static tokenInvalid(message?: string) {
    return new AppException({
      httpStatus: HttpStatus.UNAUTHORIZED,
      internalCode: InternalStatusCodes.TOKEN_INVALID,
      message,
    })
  }

  static permissionDenied(message?: string) {
    return new AppException({
      httpStatus: HttpStatus.FORBIDDEN,
      internalCode: InternalStatusCodes.PERMISSION_DENIED,
      message,
    })
  }

  static resourceAlreadyExists(message?: string) {
    return new AppException({
      httpStatus: HttpStatus.CONFLICT,
      internalCode: InternalStatusCodes.RESOURCE_ALREADY_EXISTS,
      message,
    })
  }

  static internal(message?: string, details?: unknown) {
    return new AppException({
      details,
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      internalCode: InternalStatusCodes.INTERNAL_ERROR,
      message,
    })
  }
}
