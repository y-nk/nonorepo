# unified-loader

## What

A webpack loader for processing files with [unified](https://unifiedjs.com/), with a default setting to a "classic" remark-rehype pipeline.

## Why

You could eventually use [@mdx-js/loader](https://mdxjs.com/packages/loader/) for most of cases, but it won't allow to write `<style>` or `<script>` tags in your markdown.

## How

In your webpack config, add a rule for markdown:

```js
{
  test: /\.md$/,
  use: [{
    loader: 'unified-loader',
    options: {}
  }],
}
```

### Options

Options can take 2 shapes:

```
type GenericOptions = {
  createPayload?: (mdContent: string) => string
  plugins?: UnifiedPlugin[],
}

type DefaultPipelineOptions = {
  createPayload?: (mdContent: string) => string
  remarkPlugins?: UnifiedPlugin[],
  rehypePlugins?: UnifiedPlugin[],
}

type Options = GenericOptions | DefaultPipelineOptions
```

#### Generic Options

This will give the most flexibility. You are expected to pass _every_ plugin to process your file, which should leave the pipeline ending with a `Value = { value: string }` type.

#### Default Pipeline Options

This will probably be the most used. The structure is very familiar if you ever worked with remark/rehype tools. You are expected to give your remark and rehype plugins respectively in `remarkPlugins[]` and `rehypePlugins[]`

#### createPayload

You can modify directly the output of the loader here. The function will be called at the end of the loader to wrap the content of the file with custom code. There's already a `reactPayload` and `stringPayload` to help getting started.
