import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)

const KEY_LENGTH = 64
const SALT_LENGTH = 16
const HASH_SEPARATOR = ':'

export function isPasswordHash(value: string): boolean {
  const [salt, hash] = value.split(HASH_SEPARATOR)
  return Boolean(salt && hash)
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH).toString('hex')
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer

  return `${salt}${HASH_SEPARATOR}${derivedKey.toString('hex')}`
}

export async function verifyPassword(
  password: string,
  storedValue: string,
): Promise<boolean> {
  if (!isPasswordHash(storedValue)) {
    return storedValue === password
  }

  const [salt, hash] = storedValue.split(HASH_SEPARATOR)
  const storedHash = Buffer.from(hash, 'hex')
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer

  if (storedHash.length !== derivedKey.length) {
    return false
  }

  return timingSafeEqual(storedHash, derivedKey)
}
