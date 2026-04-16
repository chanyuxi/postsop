import type { RefreshSessionService } from '@/modules/auth/services/refresh-session.service'
import { SignOutUseCase } from '@/modules/auth/use-cases/sign-out.use-case'

describe('SignOutUseCase', () => {
  const refreshSessionService = {
    invalidateSession: jest.fn(),
  } as unknown as RefreshSessionService

  let useCase: SignOutUseCase

  beforeEach(() => {
    jest.clearAllMocks()
    useCase = new SignOutUseCase(refreshSessionService)
  })

  it('invalidates the current session', async () => {
    refreshSessionService.invalidateSession = jest
      .fn()
      .mockResolvedValue(undefined)

    await useCase.execute('session-1')

    expect(refreshSessionService.invalidateSession).toHaveBeenCalledWith(
      'session-1',
    )
  })
})
