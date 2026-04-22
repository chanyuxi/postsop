import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Test } from '@nestjs/testing'

import { RedisConnectionService } from '@/cache/redis-connection.service'

describe('RedisConnectionService', () => {
  const cacheStore = new Map<string, string>()
  const cacheManager = {
    del: jest.fn((key: string) => {
      cacheStore.delete(key)
      return Promise.resolve()
    }),
    get: jest.fn((key: string) => Promise.resolve(cacheStore.get(key))),
    set: jest.fn((key: string, value: string) => {
      cacheStore.set(key, value)
      return Promise.resolve()
    }),
  }

  let service: RedisConnectionService

  beforeEach(async () => {
    cacheStore.clear()
    jest.clearAllMocks()

    const moduleRef = await Test.createTestingModule({
      providers: [
        RedisConnectionService,
        {
          provide: CACHE_MANAGER,
          useValue: cacheManager,
        },
      ],
    }).compile()

    service = moduleRef.get(RedisConnectionService)
  })

  it('passes startup validation when Redis round-trip succeeds', async () => {
    await expect(service.onModuleInit()).resolves.toBeUndefined()

    expect(cacheManager.set).toHaveBeenCalledTimes(1)
    expect(cacheManager.get).toHaveBeenCalledTimes(1)
    expect(cacheManager.del).toHaveBeenCalledTimes(1)
  })

  it('fails startup when Redis does not persist the health-check value', async () => {
    cacheStore.clear()
    jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(undefined)

    await expect(service.onModuleInit()).rejects.toThrow(
      'Redis cache connection failed',
    )
  })

  it('fails startup when Redis operations throw', async () => {
    jest
      .spyOn(cacheManager, 'set')
      .mockRejectedValueOnce(new Error('connect ECONNREFUSED'))

    await expect(service.onModuleInit()).rejects.toThrow('connect ECONNREFUSED')
  })
})
