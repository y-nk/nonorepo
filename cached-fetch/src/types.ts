export type Fetch = typeof fetch

export type Awaitable<T> = T | Promise<T>

export type Store<T> = {
  has(key: string): Date | undefined
  get(key: string): { value?: T, date?: Date }
  set(key: string, val: T, date?: Date): void
  del(key: string): boolean
  clear(): void
}

export type GetCacheKey = (...args: Parameters<Fetch>) => string | false

export type CachePolicy = (
  fetchData: { fetch: Fetch, args: Parameters<Fetch> },
  cacheData: { key: string, cache: Store<Response | Promise<Response>> }
) => Promise<Response>
