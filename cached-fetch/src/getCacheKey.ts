import { GetCacheKey } from "./types";

function sortedObject<T extends Record<string, any>>(obj: T) {
  return Object.fromEntries(
    Object.keys(obj).sort().map(key => [key, obj[key]])
  ) as T
}

export const getCacheKey: GetCacheKey = (input, init) => {
  const req = !(input instanceof Request)
    ? new Request(input, init)
    : input


  if (req.method.toLowerCase() !== 'get') {
    return false
  }

  const keys: (keyof Request)[] = [
//    'cache', // string -> makes no sense from "only-if-cached" PoV, but for dedupe maybe?
    'credentials', // string
    'destination', // string
    'integrity', // string
    'method', // string
    'mode', // string
    'redirect', // string
    'referrer', // string
    'referrerPolicy', // string
    'url', // string
  ]

  // header keys should be lowercase
  const headers: [string, string][] = []
  req.headers.forEach((val, key) => {
    headers.push([key.toLowerCase(), val ?? ''])
  })

  const json = sortedObject({
    // ...and sorted
    headers: sortedObject(Object.fromEntries(headers)),

    ...Object.fromEntries(
      keys.map(key => [key, req[key] ?? ''])
    ),
  })

  return JSON.stringify(json)
}
