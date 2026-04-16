import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'

import { permissionNames } from '@postsop/access-control/permissions'

import { hashPassword } from '../src/common/utils/password.util'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPasswordHash = await hashPassword('password')

  await prisma.permission.createMany({
    data: permissionNames.map((name) => ({ name })),
  })

  await prisma.role.createMany({
    data: [{ name: 'admin' }, { name: 'user' }],
  })

  await prisma.role.update({
    where: { name: 'admin' },
    data: {
      permissions: {
        connect: permissionNames.map((name) => ({ name })),
      },
    },
  })

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPasswordHash,
      profile: {
        create: {
          nickname: 'Seven Star',
        },
      },
      roles: {
        connect: [{ name: 'admin' }],
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
