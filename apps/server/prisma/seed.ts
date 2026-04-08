import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'

import { hashPassword } from '../src/common/utils/password.util'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPasswordHash = await hashPassword('password')

  await prisma.permission.createMany({
    data: [
      { name: 'create:user' },
      { name: 'read:user' },
      { name: 'update:user' },
      { name: 'delete:user' },
    ],
  })

  await prisma.role.createMany({
    data: [{ name: 'admin' }, { name: 'user' }],
  })

  await prisma.role.update({
    where: { id: 1 },
    data: {
      permissions: {
        connect: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
      },
    },
  })

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPasswordHash,
      roles: {
        connect: [{ id: 1 }],
      },
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
