import type {
  Awaitable,
  CachePolicy,
  Fetch,
  GetCacheKey,
  Store,
} from './types'

import debug from 'debug'

import { DEFAULT_POLICIES } from './policies'

import { getCacheKey as defaultGetCacheKey } from './getCacheKey'

import { createMemoryStore } from './stores/createMemoryStore'

const log = debug('fetch')

export type CachedFetchOptions = {
  cache: Store<Awaitable<Response>>
  getCacheKey: GetCacheKey
  policies: Record<RequestCache, CachePolicy>
}

export function createCachedFetch(fetch: Fetch, {
  cache = createMemoryStore(),
  getCacheKey = defaultGetCacheKey,
  policies = DEFAULT_POLICIES,
}: Partial<CachedFetchOptions> = {}) {
  return async function cachedFetch(...args) {
    const key = getCacheKey(...args)

    // only cache keyable requests
    if (!key) return fetch(...args)

    // route to the proper policy
    const policy = new Request(...args).cache

    log('using fetch policy', { key, policy })
    return policies[policy]({ fetch, args }, { cache, key })
  } as Fetch
}
