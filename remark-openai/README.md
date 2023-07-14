# remark-openai

## What is it?

It's a [remark](https://github.com/remarkjs/remark) plugin which transforms code blocks (marked with language `openai`) into generated content using the [OpenAI](openai.com) api.

## When should I use?

You want to quickly generate formatted content using openai, probably to be consumed later by a static site generator like [Astro](astro.build).

## How to use it?

Simply add the plugin to the list of plugins you're using already in your remark(/rehype) pipeline. You'll need to pass your own api key which you can generate [here](https://platform.openai.com/account/api-keys)

For example:

```js
import { unified } from "unified";

import remarkParse from "remark-parse";
import remarkOpenAi from "remark-openai";
import remarkHtml from "remark-html";

const { value } = await unified()
  .use([
    remarkParse,
    [remarkOpenAi, { apiKey: '<YOUR API KEY HERE>' }],
    remarkHtml,
  ])
  .process();

console.log(value)
```

## Testing locally

If you want to integrate this plugin into your pipeline but keep developing with it, you may want to avoid calling the OpenAI API all the time. For this, you can pass a `mock` function which will be called in place of the AI engine job.

Simply add the plugin to the list of plugins you're using already in your remark(/rehype) pipeline. You'll need to pass your own api key which you can generate [here](https://platform.openai.com/account/api-keys)

For example:

```js
import { unified } from "unified";

import remarkParse from "remark-parse";
import remarkOpenAi from "remark-openai";
import remarkHtml from "remark-html";

const { value } = await unified()
  .use([
    remarkParse,
    [remarkOpenAi, {
      apiKey: '<YOUR API KEY HERE>',
      mock: (prompt) => prompt,
    }],
    remarkHtml,
  ])
  .process();

console.log(value)
```


## Advanced usage

If you require to pass some options to the OpenAI client (for debugging or else), you can omit the `apiKey` parameter and pass a client instance directly.

```js
import { unified } from "unified";

import remarkParse from "remark-parse";
import remarkOpenAi from "remark-openai";
import remarkHtml from "remark-html";

import { Configuration, OpenAIApi } from "openai";

const { value } = await unified()
  .use([
    remarkParse,
    [remarkOpenAi, {
      client: new OpenAIApi(
        new Configuration({ apiKey: '<YOUR API KEY HERE>' })
      ),
    }],
    remarkHtml,
  ])
  .process();

console.log(value)
```

## How to configure it?

### Globally

Aside from `apiKey` and `client`, all the other parameters will be passed along as the plugin makes calls to the OpenAI Api. This gives you an opportunity to create a global configuration for all your generated content:

```js
import { unified } from "unified";

import remarkParse from "remark-parse";
import remarkOpenAi from "remark-openai";
import remarkHtml from "remark-html";

const { value } = await unified()
  .use([
    remarkParse,
    [remarkOpenAi, {
      apiKey: '<YOUR API KEY HERE>',
      model: 'text-davinci-003',
      max_tokens: 1024,
    }],
    remarkHtml,
  ])
  .process();

console.log(value)
```

### Per code block

In your markdown content, the metadata found next to the code block will be parsed using [json5](https://json5.org/) and used as parameters for your api call. This gives you opportunity to try different sets of parameters concurrently on the same document.

```md
    ## Using GPT3.5

    ```openai
    explain the benefits of ai generated content in less than 100 words
    ```

    ## Using custom model

    ```openai { model: 'text-davinci-003' }
    explain the benefits of ai generated content in less than 100 words
    ```
```

### Creating adapters

If you're not happy with the existing presets, you can always override them. You can build your own using the `adapters` option such as:

```js
import { unified } from "unified";

import remarkParse from "remark-parse";
import remarkOpenAi from "remark-openai";
import remarkHtml from "remark-html";

const { value } = await unified()
  .use([
    remarkParse,
    [remarkOpenAi, {
      apiKey: '<YOUR API KEY HERE>',
      adapters: {
        'this-new-adapter': {
          model: 'gpt-4-32k',
          call: 'createChatCompletion',
          prompt: (prompt) => ({ messages: [{ role: 'user', content: prompt }] }),
          parse: ({ choices }) => choices[0].message.content,
        }
      },
    }],
    remarkHtml,
  ])
  .process();

console.log(value)
```

The keyword `this-new-adapter` will be matched when used in your markdown content like this:

```md
    ```openai { adapter: "this-new-adapter" }
    create a poem about generated content from ai
    ```
```
