import { CachePolicy } from "../types"
import { reloadPolicy } from "./reloadPolicy"

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
 * no-cache — The browser looks for a matching request in its HTTP cache.
 * If there is a match, fresh or stale, the browser will make a conditional request to the remote server. If the server indicates that the resource has not changed, it will be returned from the cache. Otherwise the resource will be downloaded from the server and the cache will be updated.
 * If there is no match, the browser will make a normal request,
 * and will update the cache with the downloaded resource.
 */
export const noCachePolicy: CachePolicy = async ({ fetch, args }, { cache, key }) => {
  // TODO: implement properly
  return reloadPolicy({ fetch, args }, { cache, key })
}
