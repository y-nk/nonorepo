import {
  afterAll,
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

const spiedPolicy = vi.spyOn(DEFAULT_POLICIES, 'no-store')

let cache = createMemoryStore<Response | Promise<Response>>()
let cachedFetch = createCachedFetch(spiedFetch as unknown as Fetch, { cache })

const input = 'http://localhost:9999'
const init: RequestInit = { cache: 'no-store' }

const cacheKey = getCacheKey(input, init) as string

afterAll(() => {
  spiedFetch.mockClear()
  spiedPolicy.mockClear()
})

it('no-store policy', async () => {
  const p1 = cachedFetch(input, init)
  expect(spiedPolicy).toHaveBeenCalled()
  expect(spiedFetch).toHaveBeenCalledTimes(1)
  expect(cache.has(cacheKey)).toBeUndefined()

  const r1 = await p1
  expect(await r1.text()).toBe('hello world')

  const p2 = cachedFetch(input, init)
  expect(spiedPolicy).toHaveBeenCalled()
  expect(spiedFetch).toHaveBeenCalledTimes(2)
  expect(cache.has(cacheKey)).toBeUndefined()

  const r2 = await p2
  expect(await r2.text()).toBe('hello world') // can consume the response again
})
