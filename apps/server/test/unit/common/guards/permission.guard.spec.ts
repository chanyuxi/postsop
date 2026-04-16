import type { ExecutionContext } from '@nestjs/common'
import type { Reflector } from '@nestjs/core'

import {
  encodePermissionMask,
  permissionRegistryVersion,
} from '@postsop/access-control'
import { Codes } from '@postsop/contracts/http'

import { AppException } from '@/common/exceptions/app.exception'
import { PermissionGuard } from '@/common/guards/permission.guard'

describe('PermissionGuard', () => {
  const createContext = (
    userId?: number,
    permissions: readonly (
      | 'create:user'
      | 'read:user'
      | 'update:user'
      | 'delete:user'
    )[] = [],
  ): ExecutionContext =>
    ({
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          authContext: userId
            ? {
                pm: encodePermissionMask(permissions),
                pv: permissionRegistryVersion,
                sid: 'session-1',
                sub: userId,
              }
            : undefined,
        }),
      }),
    }) as unknown as ExecutionContext

  it('allows access when no permissions are required', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    } as unknown as Reflector
    const guard = new PermissionGuard(reflector)

    await expect(guard.canActivate(createContext(1))).resolves.toBe(true)
  })

  it('allows access when the user has all required permissions', async () => {
    const reflector = {
      getAllAndOverride: jest
        .fn()
        .mockReturnValue(['read:user', 'update:user']),
    } as unknown as Reflector
    const guard = new PermissionGuard(reflector)

    await expect(
      guard.canActivate(createContext(1, ['read:user', 'update:user'])),
    ).resolves.toBe(true)
  })

  it('rejects access when the user misses a required permission', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['delete:user']),
    } as unknown as Reflector
    const guard = new PermissionGuard(reflector)

    const permissionCheck = guard.canActivate(createContext(1, ['read:user']))

    await expect(permissionCheck).rejects.toBeInstanceOf(AppException)
    await expect(permissionCheck).rejects.toMatchObject({
      code: Codes.PERMISSION_DENIED,
    })
  })

  it('rejects access when the request is missing user context', async () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['read:user']),
    } as unknown as Reflector
    const guard = new PermissionGuard(reflector)

    const permissionCheck = guard.canActivate(createContext())

    await expect(permissionCheck).rejects.toBeInstanceOf(AppException)
    await expect(permissionCheck).rejects.toMatchObject({
      code: Codes.UNAUTHORIZED,
    })
  })
})
