# remark-regexp

A remark plugin which helps manipulating markdown content from regular expressions.

## When

For super quick replacements. There's a more advanced plugin which can do better called [remark-directive](https://www.npmjs.com/package/remark-directive) but it's usage is a big more verbose.

## How

```js
import { h } from 'hastscript'; // this is optional

// in your remark plugins
  [remarkRegexp,
    [
      {
        test: /^!> /,
        // passing a string will work as tagName
        replace: 'mark',
      },
      {
        test: /^!! /,
        // you can also pass an hast Element to add attributes
        replace: h('div', { className: 'disclaimer '}),
      },
      {
        test: /^::(\w+)(.(\w+))? /,
        // or a function which can return either string | Element
        replace: (val, matches = []) => {
          return h(matches[0], { className: matches[2] })
        }
      }
    ]
  ]
```

↓

```md
!> marked!

!! disclaiming content.

::section.foobar hello world
```

↓

```html
<mark>marked!</marked>
<div class="disclaimer">disclaiming content.</div>
<section class="foobar">hello world</section>
```
