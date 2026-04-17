import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../src/generated/prisma/client'
import {
  checkPermissionMirror,
  formatPermissionMirrorDiff,
  hasPermissionMirrorDrift,
  PermissionMirrorSyncError,
  syncPermissionMirror,
} from '../src/modules/permission/permission-mirror'

type PermissionMirrorCommand = 'check' | 'sync'

const command = process.argv[2] as PermissionMirrorCommand | undefined
const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] })
const prisma = new PrismaClient({ adapter })

async function main() {
  if (command !== 'check' && command !== 'sync') {
    throw new Error('Usage: tsx prisma/permissions.ts <check|sync>')
  }

  if (command === 'check') {
    const result = await checkPermissionMirror(prisma)

    if (hasPermissionMirrorDrift(result.diff)) {
      console.error(
        `Permission mirror drift detected.\n${formatPermissionMirrorDiff(result.diff)}`,
      )
      process.exitCode = 1
      return
    }

    console.log('Permission mirror is in sync.')
    return
  }

  const result = await syncPermissionMirror(prisma)

  if (!hasPermissionMirrorDrift(result.diff)) {
    console.log('Permission mirror is already in sync.')
    return
  }

  console.log(
    `Permission mirror synchronized. created=${result.createdPermissions.length} updated=${result.updatedPermissions.length} deleted=${result.deletedPermissions.length}`,
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    if (error instanceof PermissionMirrorSyncError) {
      console.error(error.message)
    } else {
      console.error(error)
    }

    await prisma.$disconnect()
    process.exit(1)
  })
