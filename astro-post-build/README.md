# astro-post-build integration

## What is it?

It is a wrapper around the `astro:build:done` hook to be able to run a function after all is built.

## How to use it?

1. install it with your package manager `@y_nk/astro-post-build`
2. import it in your astro config `import postBuild from '@y_nk/astro-post-build'`
3. put it into your integration stack: `integrations: [postBuild(async () => {})]`

## Why does it exist?

If you want to execute things _post build_ which depends on the astro config, you may find that an inline integration is enough. For example you could write:

```ts
{
  integrations: [
    {
      name: 'post build actions',
      hooks: {
        async 'astro:build:done'() {}
      }
    }
  ]
}
```

...but this will not execute really **last** if you have an adapter ; rather it will execute last _before_ the adapter hooks. This is where this integration becomes handy.
