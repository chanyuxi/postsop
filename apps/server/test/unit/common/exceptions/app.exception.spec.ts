import { HttpStatus } from '@nestjs/common'

import { Codes } from '@postsop/contracts/http'

import { AppException } from '@/common/exceptions/app.exception'

describe('AppException', () => {
  it('rejects successful http statuses for failure codes', () => {
    expect(
      () =>
        new AppException({
          code: Codes.INVALID_PARAMS,
          httpStatus: HttpStatus.OK,
        }),
    ).toThrow(
      'AppException cannot use successful HTTP status 200 for failure code 101000',
    )
  })

  it('rejects success codes', () => {
    expect(
      () =>
        new AppException({
          code: Codes.SUCCESS,
          httpStatus: HttpStatus.BAD_REQUEST,
        }),
    ).toThrow('AppException cannot use Codes.SUCCESS')
  })
})
