import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants'

import { API_ENDPOINT_METADATA } from '@/common/decorators/endpoint-handler.decorator'
import { AuthController } from '@/modules/auth/controllers/auth.controller'
import { PermissionController } from '@/modules/permission/controllers/permission.controller'
import { UserController } from '@/modules/user/controllers/user.controller'

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

jest.mock('@/modules/permission/services/permission.service', () => ({
  PermissionService: class PermissionService {},
}))

jest.mock('@/modules/user/queries/user-profile.query.service', () => ({
  UserProfileQueryService: class UserProfileQueryService {},
}))

const controllerClasses = [AuthController, PermissionController, UserController]

describe('Endpoint contract coverage', () => {
  it.each(controllerClasses)(
    '%p routes are all backed by shared endpoint contracts',
    (controllerClass) => {
      const prototype = controllerClass.prototype as unknown as Record<
        string,
        object
      >
      const routeHandlers = Object.getOwnPropertyNames(prototype)
        .filter((methodName) => methodName !== 'constructor')
        .map((methodName) => prototype[methodName])
        .filter(
          (handler) =>
            Reflect.getMetadata(PATH_METADATA, handler) !== undefined &&
            Reflect.getMetadata(METHOD_METADATA, handler) !== undefined,
        )

      expect(routeHandlers.length).toBeGreaterThan(0)

      routeHandlers.forEach((handler) => {
        const endpoint = Reflect.getMetadata(API_ENDPOINT_METADATA, handler) as
          | { path: string }
          | undefined
        const routePath = Reflect.getMetadata(PATH_METADATA, handler) as
          | string
          | undefined

        expect(endpoint).toBeDefined()
        expect(routePath).toBe(endpoint?.path.replace(/^\/+/, ''))
      })
    },
  )
})
