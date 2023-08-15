import type { PluggableList } from "unified";
import type { Options as RemarkParseOptions } from "remark-parse";
import type { Options as RemarkRehypeOptions } from "remark-rehype";
import type { Options as RehypeStringifyOptions } from "rehype-stringify";

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

export type ParserOptions = {
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
  remarkParseOptions?: RemarkParseOptions;
  remarkRehypeOptions?: RemarkRehypeOptions;
  rehypeStringifyOptions?: RehypeStringifyOptions;
};

export async function parseMarkdown(markdown: string, {
  remarkPlugins = [],
  rehypePlugins = [],
  remarkParseOptions = {},
  remarkRehypeOptions = {},
  rehypeStringifyOptions = {},
}: ParserOptions = { }) {
  const file = await unified()
    .use([remarkParse, remarkParseOptions])
    .use(remarkPlugins)
    .use(remarkGfm)
    .use([remarkRehype, remarkRehypeOptions])
    .use(rehypePlugins)
    .use([rehypeStringify, rehypeStringifyOptions])
    .process(markdown)

  return String(file)
}
