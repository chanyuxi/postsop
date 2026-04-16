import { hashPassword, verifyPassword } from '@/common/utils/password.util'

describe('password.util', () => {
  it('hashes passwords and verifies the generated hash', async () => {
    const password = 'secret-password'
    const passwordHash = await hashPassword(password)

    expect(passwordHash).not.toBe(password)
    await expect(verifyPassword(password, passwordHash)).resolves.toBe(true)
    await expect(verifyPassword('wrong-password', passwordHash)).resolves.toBe(
      false,
    )
  })

  it('rejects stored plaintext passwords', async () => {
    await expect(
      verifyPassword('plaintext-password', 'plaintext-password'),
    ).resolves.toBe(false)
  })
})
