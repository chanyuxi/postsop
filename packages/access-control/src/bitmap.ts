import { z } from 'zod'

import type { PermissionName } from './permissions'
import {
  getPermissionIndex,
  permissionCount,
  permissionNames,
} from './permissions'

export const PermissionMaskSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[A-Za-z0-9_-]+$/, 'Invalid permission mask')

export type PermissionMask = z.infer<typeof PermissionMaskSchema>

export function encodePermissionMask(
  permissions: readonly PermissionName[]
): PermissionMask {
  const bytes = new Uint8Array(Math.ceil(permissionCount / 8))

  for (const permission of new Set(permissions)) {
    const index = getPermissionIndex(permission)
    bytes[index >> 3] |= 1 << (index & 7)
  }

  return PermissionMaskSchema.parse(encodeBase64Url(bytes))
}

export function decodePermissionMask(mask: PermissionMask): PermissionName[] {
  const bytes = decodeBase64Url(mask)
  const permissions: PermissionName[] = []

  for (const permission of permissionNames) {
    if (hasPermissionInBytes(bytes, getPermissionIndex(permission))) {
      permissions.push(permission)
    }
  }

  return permissions
}

export function hasPermission(
  mask: PermissionMask,
  permission: PermissionName
): boolean {
  const bytes = decodeBase64Url(mask)
  return hasPermissionInBytes(bytes, getPermissionIndex(permission))
}

export function hasAllPermissions(
  mask: PermissionMask,
  permissions: readonly PermissionName[]
): boolean {
  const bytes = decodeBase64Url(mask)

  return permissions.every((permission) =>
    hasPermissionInBytes(bytes, getPermissionIndex(permission))
  )
}

function hasPermissionInBytes(bytes: Uint8Array, index: number): boolean {
  const byte = bytes[index >> 3] ?? 0
  return (byte & (1 << (index & 7))) !== 0
}

function encodeBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64url')
  }

  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function decodeBase64Url(value: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(value, 'base64url'))
  }

  const base64 = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (const [index, char] of Array.from(binary).entries()) {
    bytes[index] = char.charCodeAt(0)
  }

  return bytes
}
