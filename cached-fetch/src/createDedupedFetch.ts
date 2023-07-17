import type { Fetch, GetCacheKey, Store } from './types'

import debug from 'debug'

import { getCacheKey as defaultGetCacheKey } from './getCacheKey'
import { createMemoryStore } from './stores/createMemoryStore'

const log = debug('fetch')

export type DedupedFetchOptions = {
  cache?: Store<ReturnType<Fetch>>,
  getCacheKey?: GetCacheKey
}

export function createDedupedFetch(fetch: Fetch, {
  cache = createMemoryStore(),
  getCacheKey = defaultGetCacheKey,
}: Partial<DedupedFetchOptions> = {}) {
  return async function dedupedFetch(...args) {
    const key = getCacheKey(...args)
    if (!key) return fetch(...args)

    const { value } = cache.get(key)
    if (value) {
      log('deduping request', { key })
      return value.then(res => res.clone())
    }

    const promise = fetch(...args)
      .finally(() => cache.del(key))

    cache.set(key, promise)
    return promise.then(res => res.clone())
  } as Fetch
}
