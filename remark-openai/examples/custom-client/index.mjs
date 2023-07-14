import { readFileSync } from "fs";
import { unified } from "unified";

import remarkOpenAi from "../../index.mjs";

import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

import { Configuration, OpenAIApi } from "openai";

const markdownContent = readFileSync(`./content.md`, 'utf-8');

const { value } = await unified()
  .use([
    remarkParse,
    [remarkOpenAi, {
      client: new OpenAIApi(
        new Configuration({
          username: process.env.OPENAI_USERNAME,
          password: process.env.OPENAI_PASSWORD,
        })
      ),
    }],
    remarkHtml,
  ])
  .process(markdownContent);

console.log(value)
