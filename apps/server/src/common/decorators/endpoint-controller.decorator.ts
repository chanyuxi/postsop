import { applyDecorators, Controller, SetMetadata } from '@nestjs/common'

export const ENDPOINT_CONTROLLER_METADATA = Symbol('endpoint-controller')

export function EndpointController(namespace: string): ClassDecorator {
  return applyDecorators(
    Controller(),
    SetMetadata(
      ENDPOINT_CONTROLLER_METADATA,
      normalizeEndpointControllerNamespace(namespace),
    ),
  )
}

function normalizeEndpointControllerNamespace(namespace: string) {
  return namespace.replace(/^\/+|\/+$/g, '')
}
