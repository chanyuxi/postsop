import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants'

import {
  API_ENDPOINT_METADATA,
  ENDPOINT_CONTROLLER_METADATA,
  ENDPOINT_HANDLER_METADATA,
} from '@/common/decorators'
import { AuthController } from '@/modules/auth/controllers/auth.controller'
import { PermissionController } from '@/modules/permission/controllers/permission.controller'
import { UserController } from '@/modules/user/controllers/user.controller'

jest.mock('@/modules/auth/services/auth.service', () => ({
  AuthService: class AuthService {},
}))

jest.mock('@/modules/permission/services/permission.service', () => ({
  PermissionService: class PermissionService {},
}))

jest.mock('@/modules/user/services/user.service', () => ({
  UserService: class UserService {},
}))

const controllerClasses = [AuthController, PermissionController, UserController]

describe('Endpoint contract coverage', () => {
  it.each(controllerClasses)(
    '%p routes are all backed by shared endpoint contracts',
    (controllerClass) => {
      const namespace = Reflect.getMetadata(
        ENDPOINT_CONTROLLER_METADATA,
        controllerClass,
      ) as string | undefined
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

      expect(namespace).toBeDefined()
      expect(routeHandlers.length).toBeGreaterThan(0)

      routeHandlers.forEach((handler) => {
        const endpoint = Reflect.getMetadata(API_ENDPOINT_METADATA, handler) as
          | { path: string }
          | undefined

        expect(Reflect.getMetadata(ENDPOINT_HANDLER_METADATA, handler)).toBe(
          true,
        )
        expect(endpoint).toBeDefined()
        expect(endpoint?.path.startsWith(`/${namespace}/`)).toBe(true)
      })
    },
  )
})
