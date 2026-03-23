import { hashPassword, isPasswordHash, verifyPassword } from './password.util'

describe('password.util', () => {
  it('hashes passwords and verifies the generated hash', async () => {
    const password = 'secret-password'
    const passwordHash = await hashPassword(password)

    expect(passwordHash).not.toBe(password)
    expect(isPasswordHash(passwordHash)).toBe(true)
    await expect(verifyPassword(password, passwordHash)).resolves.toBe(true)
    await expect(verifyPassword('wrong-password', passwordHash)).resolves.toBe(
      false,
    )
  })

  it('supports legacy plaintext passwords during migration', async () => {
    expect(isPasswordHash('plaintext-password')).toBe(false)
    await expect(
      verifyPassword('plaintext-password', 'plaintext-password'),
    ).resolves.toBe(true)
  })
})
