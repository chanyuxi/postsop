import { Codes } from '@postsop/contracts/http'

import { AppException } from '@/common/exceptions/app.exception'
import { SignUpUseCase } from '@/modules/auth/use-cases/sign-up.use-case'
import type { CreateUserUseCase } from '@/modules/user/use-cases/create-user.use-case'

jest.mock('@/modules/user/use-cases/create-user.use-case', () => ({
  CreateUserUseCase: class CreateUserUseCase {},
}))

describe('SignUpUseCase', () => {
  const createUserUseCase = {
    execute: jest.fn(),
  } as unknown as CreateUserUseCase

  let useCase: SignUpUseCase

  beforeEach(() => {
    jest.clearAllMocks()
    useCase = new SignUpUseCase(createUserUseCase)
  })

  it('throws when the user already exists', async () => {
    createUserUseCase.execute = jest.fn().mockResolvedValue(null)

    const attempt = useCase.execute({
      email: 'admin@example.com',
      password: 'password',
    })

    await expect(attempt).rejects.toBeInstanceOf(AppException)
    await expect(attempt).rejects.toMatchObject({
      code: Codes.RESOURCE_ALREADY_EXISTS,
    })
  })
})
