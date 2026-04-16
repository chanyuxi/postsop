import { AuthService } from '@/modules/auth/services/auth.service'
import type { RefreshAuthSessionUseCase } from '@/modules/auth/use-cases/refresh-auth-session.use-case'
import type { SignInUseCase } from '@/modules/auth/use-cases/sign-in.use-case'
import type { SignOutUseCase } from '@/modules/auth/use-cases/sign-out.use-case'
import type { SignUpUseCase } from '@/modules/auth/use-cases/sign-up.use-case'

jest.mock('@/modules/auth/use-cases/refresh-auth-session.use-case', () => ({
  RefreshAuthSessionUseCase: class RefreshAuthSessionUseCase {},
}))

jest.mock('@/modules/auth/use-cases/sign-in.use-case', () => ({
  SignInUseCase: class SignInUseCase {},
}))

jest.mock('@/modules/auth/use-cases/sign-out.use-case', () => ({
  SignOutUseCase: class SignOutUseCase {},
}))

jest.mock('@/modules/auth/use-cases/sign-up.use-case', () => ({
  SignUpUseCase: class SignUpUseCase {},
}))

describe('AuthService', () => {
  const signUpUseCase = {
    execute: jest.fn(),
  } as unknown as SignUpUseCase

  const signInUseCase = {
    execute: jest.fn(),
  } as unknown as SignInUseCase

  const signOutUseCase = {
    execute: jest.fn(),
  } as unknown as SignOutUseCase

  const refreshAuthSessionUseCase = {
    execute: jest.fn(),
  } as unknown as RefreshAuthSessionUseCase

  let authService: AuthService

  beforeEach(() => {
    jest.clearAllMocks()
    authService = new AuthService(
      signUpUseCase,
      signInUseCase,
      signOutUseCase,
      refreshAuthSessionUseCase,
    )
  })

  it('delegates sign-up requests to the sign-up use case', async () => {
    signUpUseCase.execute = jest.fn().mockResolvedValue(undefined)

    await authService.signUp({
      email: 'new-user@example.com',
      password: 'password',
    })

    expect(signUpUseCase.execute).toHaveBeenCalledWith({
      email: 'new-user@example.com',
      password: 'password',
    })
  })

  it('delegates sign-in requests to the sign-in use case', async () => {
    signInUseCase.execute = jest.fn().mockResolvedValue({
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      },
      user: {
        email: 'admin@example.com',
        id: 1,
        roles: [{ name: 'admin' }],
      },
    })

    await authService.signIn({
      email: 'admin@example.com',
      password: 'password',
    })

    expect(signInUseCase.execute).toHaveBeenCalledWith({
      email: 'admin@example.com',
      password: 'password',
    })
  })

  it('delegates sign-out requests to the sign-out use case', async () => {
    signOutUseCase.execute = jest.fn().mockResolvedValue(undefined)

    await authService.signOut('session-1')

    expect(signOutUseCase.execute).toHaveBeenCalledWith('session-1')
  })

  it('delegates refresh requests to the refresh use case', async () => {
    refreshAuthSessionUseCase.execute = jest.fn().mockResolvedValue({
      tokens: {
        accessToken: 'access-token-2',
        refreshToken: 'refresh-token-2',
      },
      user: {
        email: 'admin@example.com',
        id: 1,
        roles: [{ name: 'admin' }],
      },
    })

    await authService.refreshToken('refresh-token-1')

    expect(refreshAuthSessionUseCase.execute).toHaveBeenCalledWith(
      'refresh-token-1',
    )
  })
})
