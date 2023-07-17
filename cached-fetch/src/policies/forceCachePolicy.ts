import { CachePolicy } from "../types"

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
 * force-cache — The browser looks for a matching request in its HTTP cache.
 * If there is a match, fresh or stale, it will be returned from the cache.
 * If there is no match, the browser will make a normal request, and will update the cache with the downloaded resource.
 */
export const forceCachePolicy: CachePolicy = async ({ fetch, args }, { cache, key }) => {
  let { value } = cache.get(key)

  // cache hit
  if (value instanceof Response) {
    return value.clone()
  } else if (value instanceof Promise) {
    return value.then(res => res.clone())
  }

  // no cache
  const promise = fetch(...args)
    .then(async res => {
      cache.set(key, res)
      return res
    })

  cache.set(key, promise)
  return promise.then(res => res.clone())
}
