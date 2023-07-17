import { CachePolicy } from "../types"

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
 * only-if-cached — The browser looks for a matching request in its HTTP cache.
 * If there is a match, fresh or stale, it will be returned from the cache.
 * If there is no match, the browser will respond with a 504 Gateway timeout status.
 * The "only-if-cached" mode can only be used if the request's mode is "same-origin". Cached redirects will be followed if the request's redirect property is "follow" and the redirects do not violate the "same-origin" mode.
 */
export const onlyIfCachedPolicy: CachePolicy = async (_, { cache, key }) => {
  const { value } = cache.get(key)

  return value ?? new Response(null, {
    status: 504,
    statusText: 'Gateway timeout',
  })
}
