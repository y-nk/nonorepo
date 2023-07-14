import { readFileSync } from "fs";
import { unified } from "unified";

import remarkOpenAi from "../../index.mjs";

import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

const markdownContent = readFileSync(`./content.md`, 'utf-8');

const { value } = await unified()
  .use([
    remarkParse,
    [remarkOpenAi, { apiKey: process.env.OPENAI_API_KEY }],
    remarkHtml,
  ])
  .process(markdownContent);

console.log(value)
