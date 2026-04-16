import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

export function createOpaqueToken(byteLength = 32): string {
  return randomBytes(byteLength).toString('base64url')
}

export function hashSha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

export function timingSafeEqualHex(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, 'hex')
  const rightBuffer = Buffer.from(right, 'hex')

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}
