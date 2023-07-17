import {
  afterAll,
  beforeEach,
  expect,
  it,
  vi,
} from 'vitest'

import {
  Fetch,
  createCachedFetch,
  createMemoryStore,
  DEFAULT_POLICIES,
  getCacheKey,
} from '..'

const spiedFetch = vi.spyOn(globalThis, 'fetch')
  .mockImplementation(async () => new Response('hello world'))

const spiedPolicy = vi.spyOn(DEFAULT_POLICIES, 'reload')

let cache = createMemoryStore<Response | Promise<Response>>()
let cachedFetch = createCachedFetch(spiedFetch as unknown as Fetch, { cache })

const input = 'http://localhost:9999'
const init: RequestInit = { cache: 'reload' }

const cacheKey = getCacheKey(input, init) as string

beforeEach(() => {
  spiedFetch.mockClear()
  spiedPolicy.mockClear()
})

afterAll(() => {
  spiedFetch.mockReset()
  spiedPolicy.mockReset()
})

it('makes request for the 1st time', async () => {
  const promise = cachedFetch(input, init)
  expect(spiedPolicy).toHaveBeenCalled()
  expect(spiedFetch).toHaveBeenCalled()

  expect(cache.has(cacheKey)).toBeDefined()
  expect(cache.get(cacheKey).value).toStrictEqual(promise)

  const response = await promise
  expect(cache.get(cacheKey).value).toBeInstanceOf(Response)

  expect(await response.text()).toBe('hello world')
})

it('reuses cache for the 2nd time', async () => {
  const cached = cache.get(cacheKey)
  expect(cached.value).toBeDefined()

  const promise = cachedFetch(input, init)
  expect(spiedPolicy).toHaveBeenCalled()
  expect(spiedFetch).toHaveBeenCalled() // no cache hit
  expect(cache.get(cacheKey).date).not.toEqual(cached.date) // cache updated

  const response = await promise
  expect(await response.text()).toBe('hello world')
})
