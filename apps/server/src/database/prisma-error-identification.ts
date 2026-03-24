import { Prisma } from '@/generated/prisma/client'

type PrismaKnownRequestErrorCode =
  | 'P2000'
  | 'P2002'
  | 'P2003'
  | 'P2004'
  | 'P2011'
  | 'P2014'
  | 'P2025'

export class PrismaErrorIdentification {
  private static readonly CREATE_ERROR_CODES: readonly PrismaKnownRequestErrorCode[] =
    ['P2000', 'P2002', 'P2003', 'P2004', 'P2011', 'P2014']

  private static readonly UPDATE_ERROR_CODES: readonly PrismaKnownRequestErrorCode[] =
    ['P2000', 'P2002', 'P2003', 'P2004', 'P2011', 'P2014', 'P2025']

  private static readonly DELETE_ERROR_CODES: readonly PrismaKnownRequestErrorCode[] =
    ['P2003', 'P2004', 'P2014', 'P2025']

  static isKnownRequestError(
    error: unknown,
  ): error is Prisma.PrismaClientKnownRequestError {
    return error instanceof Prisma.PrismaClientKnownRequestError
  }

  static isUnknownRequestError(
    error: unknown,
  ): error is Prisma.PrismaClientUnknownRequestError {
    return error instanceof Prisma.PrismaClientUnknownRequestError
  }

  static isValidationError(
    error: unknown,
  ): error is Prisma.PrismaClientValidationError {
    return error instanceof Prisma.PrismaClientValidationError
  }

  static isInitializationError(
    error: unknown,
  ): error is Prisma.PrismaClientInitializationError {
    return error instanceof Prisma.PrismaClientInitializationError
  }

  static isRustPanicError(
    error: unknown,
  ): error is Prisma.PrismaClientRustPanicError {
    return error instanceof Prisma.PrismaClientRustPanicError
  }

  static isValueTooLongError(
    error: unknown,
  ): error is Prisma.PrismaClientKnownRequestError {
    return this.hasErrorCode(error, 'P2000')
  }

  static isUniqueConstraintError(
    error: unknown,
  ): error is Prisma.PrismaClientKnownRequestError {
    return this.hasErrorCode(error, 'P2002')
  }

  static isForeignKeyConstraintError(
    error: unknown,
  ): error is Prisma.PrismaClientKnownRequestError {
    return this.hasErrorCode(error, 'P2003')
  }

  static isConstraintError(
    error: unknown,
  ): error is Prisma.PrismaClientKnownRequestError {
    return this.hasErrorCode(error, 'P2004')
  }

  static isNullConstraintError(
    error: unknown,
  ): error is Prisma.PrismaClientKnownRequestError {
    return this.hasErrorCode(error, 'P2011')
  }

  static isRequiredRelationError(
    error: unknown,
  ): error is Prisma.PrismaClientKnownRequestError {
    return this.hasErrorCode(error, 'P2014')
  }

  static isRecordNotFoundError(
    error: unknown,
  ): error is Prisma.PrismaClientKnownRequestError {
    return this.hasErrorCode(error, 'P2025')
  }

  static isCreateError(error: unknown): boolean {
    return this.hasErrorCode(error, ...this.CREATE_ERROR_CODES)
  }

  static isUpdateError(error: unknown): boolean {
    return this.hasErrorCode(error, ...this.UPDATE_ERROR_CODES)
  }

  static isDeleteError(error: unknown): boolean {
    return this.hasErrorCode(error, ...this.DELETE_ERROR_CODES)
  }

  static hasErrorCode(
    error: unknown,
    ...codes: readonly PrismaKnownRequestErrorCode[]
  ): error is Prisma.PrismaClientKnownRequestError {
    return (
      this.isKnownRequestError(error) &&
      codes.includes(error.code as PrismaKnownRequestErrorCode)
    )
  }
}
