# vite-plugin-remark-rehype

## tl;dr

This plugin allows you to import markdown files, add remark/rehype plugins to process the markdown files prior import as well as viewing markdown files directly from the vite dev server.

## How to use

```ts
import { defineConfig } from "vite";
import remarkRehypePlugin from "vite-plugin-remark-rehype";

export default defineConfig({
  plugins: [
    remarkRehypePlugin(),
  ],
});
```

## Using templates

By default, the import type from a `import myMarkdown from './markdown.md'` is `string` but you can customize this behavior to accomodate your favorite framework.

The mechanism is straightforward:

1. add a `templates: {}` option to the plugin
2. in that `templates`, pass an id as key (`vue`), and a `type TemplateFn = (html: string) => string` as value.
3. change your import string to include `?as=` followed by your id, and your template function will be executed at transform time.

Example:

```ts
import { defineConfig } from "vite";
import remarkRehypePlugin, { TemplateFn } from "vite-plugin-remark-rehype";

const vueTemplateFn: TemplateFn = (html) => `export default { template: ${html} }`

export default defineConfig({
  plugins: [
    remarkRehypePlugin({
      templates: {
        vue: vueTemplateFn
      }
    }),
  ],
});
```

...and later in your files

```
import myMarkdown from '~/path-to-markdown.md?as=vue'
```

For Typescript, you will have to add the proper type support for this import string (see below).

## Adding type support

In your `tsconfig.json`

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-remark-rehype/types"]
  }
}
```

Or you can add a `.d.ts` file in your project root containing

```ts
declare module "*.md" {
  const html: string;
  export default html;
}

declare module "*.md?as=string" {
  const html: string;
  export default html;
}
```

## Configuring Remark/Rehype

```ts
import { defineConfig } from "vite";
import remarkRehypePlugin from "vite-plugin-remark-rehype";

import remarkA11yEmoji from "@fec/remark-a11y-emoji";
import rehypeSanitize from "rehype-sanitize";

export default defineConfig({
  plugins: [
    remarkRehypePlugin({
      remarkPlugins: [remarkA11yEmoji],
      rehypePlugins: [rehypeSanitize],
    }),
  ],
});
```

### Using the markdown

```ts
import html from './test.md'
document.getElementById('markdown').innerHTML = html
```

### Previewing markdown

You can directly browse `http://localhost:5173/markdown.md` and it will be processed and served.
