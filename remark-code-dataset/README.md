# remark-code-dataset

## What

It's a remark plugin which adds all metadata passed to a code block as data attributes for exploitation in rehype or client-side.

## Demo

```jsx group=demo file=index.jsx
export default function App() {
  return <div>hello world</div>;
}
```

↓

```html
<code class="language-jsx" data-group="demo" data-file="index.jsx">
  <!-- some html -->
</code>
```

## How

1. Install the plugin with `npm i remark-code-dataset`
2. Import the plugin with `import remarkCodeDataset from 'remark-code-dataset'
3. Add to your remark plugin stack `[remarkCodeDataset]`
