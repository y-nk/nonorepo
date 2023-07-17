import { CachePolicy } from "../types"

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
 * no-store — The browser fetches the resource from the remote server without first looking in the cache,
 * and will not update the cache with the downloaded resource.
 */
export const noStorePolicy: CachePolicy = async ({ fetch, args }) => {
  return fetch(...args)
}
