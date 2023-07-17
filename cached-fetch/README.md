# cached-fetch

## What is it?

It's a small library to cache and dedupe calls, with server rendering in mind.

## How does it work?

```ts
import fetch from '@y_nk/cached-fetch'
await fetch('do as usual')
```

## Overriding global fetch

```ts
import '@y_nk/cached-fetch/register'
await fetch('do as usual')
```

## Integration with Astro

```ts
import { defineConfig } from 'astro/config';

import cachedFetch from '@y_nk/cached-fetch/astro';

export default defineConfig({
  integrations: [
    cachedFetch(),
  ]
});
```

## What does it do?

The extended api is:

```ts
import { createCachedFetch, createDedupedFetch } from '@y_nk/cached-fetch'

const fetch = createDedupedFetch(
  createCachedFetch(global.fetch)
)
```

### `createDedupedFetch`

This will create a in memory storage which will hold the fetch promises until they are settled. If many fetch calls are made to the same resources, only the 1st one will be returned.

### `createCachedFetch`

This is an implementation of the cache policy for server side. The spec is defined at https://developer.mozilla.org/en-US/docs/Web/API/Request/cache and each of the policy should be as close as possible from the original definition.

## Customisation and further

### `getCacheKey`

Both functions are using a similar `getCacheKey(...args: Parameters<typeof fetch>): string | false` function which will be used to compute a cache key for a given request. If cache is not applicable, we should return `false`, a `string` otherwise.

This function can be replaced in the options object of both `createCachedFetch` and `createDedupedFetch`.

### `cache object`

For introspection and cache manipulation, both of the function can receive an optional `cache` object which abide to the `Store<T>` interface, passed in the options object as well.

### `CachePolicy`

For decomposition and flexibility, implementation of each of the `RequestCache` value is made as an individual function. You can pass/customize each up to your liking by passing a `policies` object by yourself in the `createCachedFetch` options. The function signature will need to implement the `CachePolicy` type.
