# vite-svg-astro-loader

A vite loader dedicated to load svg files as astro components.

## What does this package do?

The only goal is to transform a `.svg` into an Astro component containing `<svg {...Astro.props}></svg>` so we can inject props and attributes to it (especially the very cool `class:list` helper)

## When do I wanna use this?

1. You want to render svg as inline components
2. You want to be able to pass them attributes (classes, aria, etc...)

## How to use this?

1. get the package from npm
2. modify your `astro.config` add the following:

```diff
import { defineConfig } from 'astro/config';

+ import svgAstroLoader from 'vite-svg-astro-loader'

// https://astro.build/config
export default defineConfig({
+  vite: {
+    plugins: [svgAstroLoader()]
+  },
});
```

3. load your svgs with `?comp` so the loader can spot them:

```astro
---
import Logo from '~/assets/svg/logo.svg?comp'
---

<Logo class="w:full" />
```

## Why does this exist?

There's no good way to import inline svgs at the moment with Astro. According to Discord, the community and the docs, the best we can do is:

```astro
---
import MySvgAsRaw from 'path-to-svg?raw'
---

<Fragment set:html={MySvgAsRaw}>
```

This not so convenient since you can't pass classes or attributes easily. I also tried to do a `<SVG>` component which looked like this:

```astro
---
export type Props = {
  raw: string // <- user needs to `import svg from 'svg?raw' and pass here
  [key: string]: string
}

const { raw, ...props } = Astro.props

const svgAsInline = raw.replace('\n', '')

const [, attrsAsString] = svgAsInline.split(/<svg\s?(.*)?>/gim)

const svgAttrs = Object.fromEntries(
  // this regex may break easily
  attrsAsString.match(/\w*="[^"]+"/gim)?.map(svgAttribute => {
    const [key, value] = svgAttribute.split('=')
    return [key, value.slice(1, -1)]
  })
)

const openingTag = `<svg ${attrsAsString}>`
const closingTag = `</svg>`

const innerSvg = svgAsInline.replace(openingTag, '').replace(closingTag, '')
---

<svg {...svgAttrs} {...props} set:html={raw} />
```

You can see the code for parsing attributes could break easily, but even we could make it smarter, theusage was stil a bit annoying. You'd have to do 2 imports, and combine them.

```astro
---
import Logo from '~/assets/svg/logo.svg?raw'
import Svg from '~/components/Svg.astro'
---

<Svg raw={Logo} class="w-full">
```

...which i personally didn't like ; and so here it is, a vite loader.

## How does it work?

Read the `index.mjs` file which is pretty self explanatory. The loader is basic and there's no big logic behind, just a little shortcut to make it work (i would love to use Astro's internal api instead but it looks like not exposed to the public. If you find a way, please make a PR)
