const optionsSchema = {
  anyOf: [
    {
      type: "object",
      additionalProperties: false,
      properties: {
        createPayload: { instanceof: "Function" },
        plugins: { type: "array" },
      },
    },
    {
      type: "object",
      additionalProperties: false,
      properties: {
        createPayload: { instanceof: "Function" },
        remarkPlugins: { type: "array" },
        rehypePlugins: { type: "array" },
      },
    },
  ],
};

async function getDefaultPipeline({
  remarkPlugins = [],
  rehypePlugins = [],
} = {}) {
  const { default: remarkParse } = await import("remark-parse");
  const { default: remarkRehype } = await import("remark-rehype");
  const { default: rehypeStringify } = await import("rehype-stringify");

  return [
    remarkParse,
    ...remarkPlugins,
    [remarkRehype, { allowDangerousHtml: true }],
    ...rehypePlugins,
    [rehypeStringify, { allowDangerousHtml: true }],
  ];
}

export function metadataExports(frontMatter = {}) {
  return Object.entries(frontMatter)
    .map(([k, v]) => `export const ${k} = ${JSON.stringify(v)}`)
    .join('\n')
}

export function stringPayload(identifier) {
  return function (mdContent, matter = {}) {
    if (Object.keys(matter).includes(identifier)) {
      throw new Error(`[unified-loader] identifier (${identifier}) collides with frontmatter key`)
    }

    return [
      metadataExports(frontMatter),
      `export ${identifier ? `const ${identifier} = ` : "default"} ${JSON.stringify(mdContent)}`
    ].join('\n\n')
  }
}

export function reactPayload(wrapperTag = "article") {
  return function (mdContent, matter = {}) {
    return `import { createElement, memo } from 'react';

${metadataExports(matter)}

const __html = ${JSON.stringify(mdContent)};
export default memo(() => createElement('${wrapperTag}', { dangerouslySetInnerHTML: { __html } }));`;
  }
}

export function nextPayload(wrapperTag = "article") {
  return function (mdContent, matter = {}) {
    return `import { createElement, memo } from 'react';

export const metadata = ${JSON.stringify(matter)};

const __html = ${JSON.stringify(mdContent)};
export default memo(() => createElement('${wrapperTag}', { dangerouslySetInnerHTML: { __html } }));`;
  }
}

export default async function unifiedLoader(source) {
  const { unified } = await import("unified");
  const { matter } = await import("vfile-matter");

  const options = this.getOptions(optionsSchema) ?? {};

  options.createPayload ??= stringPayload;

  const plugins = Array.isArray(options.plugins)
    ? options.plugins
    : await getDefaultPipeline(options);

  const { value, data } = await unified()
    .use(plugins)
    // see: https://github.com/remarkjs/remark-frontmatter#example-frontmatter-as-metadata
    .use(() => (_, file) => { matter(file) })
    .process(source);

  return options.createPayload(value, data?.matter);
}
