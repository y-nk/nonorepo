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

const spiedPolicy = vi.spyOn(DEFAULT_POLICIES, 'only-if-cached')

let cache = createMemoryStore<Response | Promise<Response>>()
let cachedFetch = createCachedFetch(fetch, { cache })

const input = 'http://localhost:9999'
const init: RequestInit = { cache: 'only-if-cached', mode: 'same-origin' }

const cacheKey = getCacheKey(input, init) as string

beforeEach(() => {
  spiedPolicy.mockClear()
})

afterAll(() => {
  spiedPolicy.mockReset()
})

it('returns 504 if not in cache', async () => {
  const promise = cachedFetch(input, init)
  expect(spiedPolicy).toHaveBeenCalled()

  const response = await promise
  expect(response.status).toBe(504)
})

it('returns a response if in cache', async () => {
  cache.set(cacheKey, new Response('hello world'))

  const promise = cachedFetch(input, init)
  expect(spiedPolicy).toHaveBeenCalled()

  const response = await promise
  expect(await response.text()).toBe('hello world')
})
