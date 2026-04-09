import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'

import { hashPassword } from '../src/common/utils/password.util'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPasswordHash = await hashPassword('password')
  // 84dddbce8e3f511041cbdc6c8e50326c:8fcfac334ef2b82bc610cf6cd5fcf7d38a1fc85cdee74dd00eb9ec5f11fa10f00360204f63c0c0b31edc040fdf9ddf34eb40b70302d006c4d638a94055badaac

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
