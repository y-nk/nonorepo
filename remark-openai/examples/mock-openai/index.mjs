import { readFileSync } from "fs";
import { unified } from "unified";

import remarkOpenAi from "../../index.mjs";

import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

const markdownContent = readFileSync(`./content.md`, 'utf-8');

const { value } = await unified()
  .use([
    remarkParse,
    [remarkOpenAi, {
      apiKey: process.env.OPENAI_API_KEY,
      mock: process.env.NODE_ENV !== 'production'
        ? (prompt) => `**will be generated in prod**: _${prompt}_`
        : undefined,
    }],
    remarkHtml,
  ])
  .process(markdownContent);

console.log(value)
