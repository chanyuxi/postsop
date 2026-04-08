import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { App } from 'supertest/types'

import { AppModule } from './../src/app.module'
import { PrismaService } from './../src/database/prisma.service'

jest.mock('@/database/prisma.service', () => ({
  PrismaService: class PrismaService {},
}))

jest.mock('@/modules/user/services/user.service', () => ({
  UserService: class UserService {},
}))

describe('App (e2e)', () => {
  let app: INestApplication<App>
  const cacheManager = {
    del: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  }
  const prismaService = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    permission: {
      findMany: jest.fn(),
    },
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  }

  beforeAll(() => {
    process.env['PORT'] = '3000'
    process.env['JWT_SECRET'] = 'test-secret'
    process.env['JWT_EXPIRATION_TIME'] = '15m'
    process.env['REFRESH_TOKEN_EXPIRATION_TIME'] = '60000'
    process.env['REDIS_URL'] = 'redis://127.0.0.1:6379'
    process.env['DATABASE_URL'] =
      'postgresql://user:password@localhost:5432/coco'
  })

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CACHE_MANAGER)
      .useValue(cacheManager)
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
    jest.clearAllMocks()
  })

  it('rejects unauthenticated access to protected routes', () => {
    return request(app.getHttpServer()).get('/auth/greeting').expect(401)
  })

  it('validates the public sign-in payload before touching the database', () => {
    return request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({})
      .expect(400)
  })

  it('keeps the refresh endpoint public while validating token shape', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh-token')
      .send({ refreshToken: 'bad-token' })
      .expect(400)
  })
})
