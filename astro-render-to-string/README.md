# astro-render-to-string

## Warnings

1. This is not an official api, use with caution
2. Because of #1, it may have limitations or unknown side effects, use with caution
3. This is awaiting the works of Astro in an RFC which may replace this very soon.

## How to use

```ts
import { renderToString } from 'astro-render-to-string'
import MyComponent from './MyComponent.astro'

console.log(renderToString(MyComponent))
```

## Use cases

[All the use cases are implemented here to see them in action.](https://codesandbox.io/p/sandbox/bold-keldysh-9fzg55)

**1. You want to use .astro file to render an svg and respond with a real svg file**

The only way to build statically a file is to use [static file endpoints](https://docs.astro.build/en/core-concepts/endpoints/#static-file-endpoints) but those require to return a Response with a string body. You can't pass any astro component there.

```ts
import { renderToString } from 'astro-render-to-string'

import MyComponent from './MyComponent.astro'

export async function get(context) {
  return new Response(...)  // <- the body should be a string
}
```

Solved this way:

```ts
import { renderToString } from 'astro-render-to-string'

import MyComponent from './MyComponent.astro'

export async function get(context) {
  return new Response(renderToString(MyComponent, context))
}
```


**2. You want to return a real 404 from an astro component in SSR**

In static build, you need to build a `src/pages/404.astro` which builds into a valid html page _then_ the server you deploy to needs to use that page as a 404 (with routing).

In SSR, the server will serve the content of the `404.astro` page as a 404 when a page is not found, but there's no programmatic way to return that same 404 if a parameter would be invalid (in a `src/pages/[...route].astro`, for example).

The proper way would be to:

```astro
---
if (some_condition) {
  return new Response(..., { status: 404 }) // <- the body should be a string
}
---

<Page />
```

solved this way (you can make an utility function out of it).

```astro
---
import FourOhFour from '~/server-pages/404.astro'

if (some_condition) {
  return new Response(renderToString(FourOhFour, Astro), {
    status: 404,
  })
}
---

<Page />
```
