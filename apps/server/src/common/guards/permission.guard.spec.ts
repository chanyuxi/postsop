import type { ExecutionContext } from '@nestjs/common'
import type { Reflector } from '@nestjs/core'

import { InternalStatusCodes } from '@postsop/contracts/http'

import { AppException } from '@/common/exceptions/app.exception'
import type { PermissionService } from '@/modules/permission/services/permission.service'

import { PermissionGuard } from './permission.guard'

jest.mock('@/modules/permission/services/permission.service', () => ({
  PermissionService: class PermissionService {},
}))

describe('PermissionGuard', () => {
  const createContext = (userId?: number): ExecutionContext =>
    ({
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          jwtPayload: userId
            ? {
                user: {
                  id: userId,
                },
                sessionId: 'session-1',
              }
            : undefined,
        }),
      }),
    }) as unknown as ExecutionContext

  it('allows access when no permissions are required', async () => {
    const getUserPermissionNames = jest.fn()
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    } as unknown as Reflector
    const permissionService = {
      getUserPermissionNames,
    } as unknown as PermissionService
    const guard = new PermissionGuard(reflector, permissionService)

    await expect(guard.canActivate(createContext(1))).resolves.toBe(true)
    expect(getUserPermissionNames).not.toHaveBeenCalled()
  })

  it('allows access when the user has all required permissions', async () => {
    const getUserPermissionNames = jest
      .fn()
      .mockResolvedValue(['read:user', 'update:user', 'delete:user'])
    const reflector = {
      getAllAndOverride: jest
        .fn()
        .mockReturnValue(['read:user', 'update:user']),
    } as unknown as Reflector
    const permissionService = {
      getUserPermissionNames,
    } as unknown as PermissionService
    const guard = new PermissionGuard(reflector, permissionService)

    await expect(guard.canActivate(createContext(1))).resolves.toBe(true)
  })

  it('rejects access when the user misses a required permission', async () => {
    const getUserPermissionNames = jest.fn().mockResolvedValue(['read:user'])
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['delete:user']),
    } as unknown as Reflector
    const permissionService = {
      getUserPermissionNames,
    } as unknown as PermissionService
    const guard = new PermissionGuard(reflector, permissionService)

    const permissionCheck = guard.canActivate(createContext(1))

    await expect(permissionCheck).rejects.toBeInstanceOf(AppException)
    await expect(permissionCheck).rejects.toMatchObject({
      internalCode: InternalStatusCodes.PERMISSION_DENIED,
    })
  })

  it('rejects access when the request is missing user context', async () => {
    const getUserPermissionNames = jest.fn()
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['read:user']),
    } as unknown as Reflector
    const permissionService = {
      getUserPermissionNames,
    } as unknown as PermissionService
    const guard = new PermissionGuard(reflector, permissionService)

    const permissionCheck = guard.canActivate(createContext())

    await expect(permissionCheck).rejects.toBeInstanceOf(AppException)
    await expect(permissionCheck).rejects.toMatchObject({
      internalCode: InternalStatusCodes.UNAUTHORIZED,
    })
  })
})
