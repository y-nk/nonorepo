import { readFileSync } from "fs";
import { unified } from "unified";

import remarkOpenAi from "../../index.mjs";
import defaultAdapters from "../../adapters.mjs";

import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

const markdownContent = readFileSync(`./content.md`, 'utf-8');

const { value } = await unified()
  .use([
    remarkParse,
    [remarkOpenAi, {
      apiKey: process.env.OPENAI_API_KEY,
      adapters: {
        'haiku-gpt': {
          ...defaultAdapters['gpt-3.5-turbo'],
          prompt: (prompt) => {
            const { messages } = defaultAdapters['gpt-3.5-turbo'].prompt(prompt)

            return {
              messages: [
                {
                  role: "system",
                  content: "write the answer as a haiku",
                },
                ...messages,
              ]
            }
          },
        }
      }
    }],
    remarkHtml,
  ])
  .process(markdownContent);

console.log(value)
