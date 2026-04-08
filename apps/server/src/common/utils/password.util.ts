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

function parsePasswordHash(value: string) {
  const [salt, hash] = value.split(HASH_SEPARATOR)

  if (!salt || !hash) {
    return null
  }

  return {
    hash,
    salt,
  }
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
  const parsedHash = parsePasswordHash(storedValue)

  if (!parsedHash) {
    return false
  }

  const storedHash = Buffer.from(parsedHash.hash, 'hex')
  const derivedKey = (await scrypt(
    password,
    parsedHash.salt,
    KEY_LENGTH,
  )) as Buffer

  if (storedHash.length !== derivedKey.length) {
    return false
  }

  return timingSafeEqual(storedHash, derivedKey)
}
