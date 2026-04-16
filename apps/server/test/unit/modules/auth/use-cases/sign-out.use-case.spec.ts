import type { SessionService } from '@/modules/auth/services/session.service'
import { SignOutUseCase } from '@/modules/auth/use-cases/sign-out.use-case'

describe('SignOutUseCase', () => {
  const sessionService = {
    invalidateSession: jest.fn(),
  } as unknown as SessionService

  let useCase: SignOutUseCase

  beforeEach(() => {
    jest.clearAllMocks()
    useCase = new SignOutUseCase(sessionService)
  })

  it('invalidates the current session', async () => {
    sessionService.invalidateSession = jest.fn().mockResolvedValue(undefined)

    await useCase.execute('session-1')

    expect(sessionService.invalidateSession).toHaveBeenCalledWith('session-1')
  })
})
