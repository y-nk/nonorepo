import { CachePolicy } from "../types"

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
 * reload — The browser fetches the resource from the remote server without first looking in the cache,
 * but then will update the cache with the downloaded resource.
 */
export const reloadPolicy: CachePolicy = async ({ fetch, args }, { cache, key }) => {
  const promise = fetch(...args)
    .then(async res => {
      cache.set(key, res)
      return res
    })

  cache.set(key, promise)
  return promise.then(res => res.clone())
}
