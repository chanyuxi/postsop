import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'

import { permissionNames } from '@postsop/access-control/permissions'

import { hashPassword } from '../src/common/utils/password.util'
import { PrismaClient } from '../src/generated/prisma/client'
import { syncPermissionMirror } from '../src/modules/permission/permission-mirror'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPasswordHash = await hashPassword('password')

  await syncPermissionMirror(prisma)

  await prisma.role.createMany({
    data: [{ name: 'admin' }, { name: 'user' }],
    skipDuplicates: true,
  })

  await prisma.role.update({
    where: { name: 'admin' },
    data: {
      permissions: {
        set: permissionNames.map((name) => ({ name })),
      },
    },
  })

  await prisma.user.upsert({
    create: {
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
    update: {
      roles: {
        connect: [{ name: 'admin' }],
      },
    },
    where: {
      email: 'admin@example.com',
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
