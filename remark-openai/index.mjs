import { visit } from "unist-util-visit";
import { remark } from "remark";

import { Configuration, OpenAIApi } from "openai";
import json5 from "json5";

import defaultAdapters from "./adapters.mjs";

const DEFAULTS = {
  model: "gpt-3.5-turbo",
  max_tokens: 150,
};

async function generateContent(prompt, client, {
  adapters: customAdapters,
  adapter: adapterName,
  mock,
  ...options
}) {
  // quick testing
  if (typeof mock === "function") {
    return mock(prompt);
  }

  // allow for custom adapters
  const adapters = {
    ...defaultAdapters,
    ...customAdapters,
  }

  // finding the proper adapter for the code block
  // 1st priority on the `adapter` keyword, fallback to `model`
  const adapter = adapters[adapterName] ?? adapters[options.model];

  if (!adapter) {
    throw new Error(`unknown chatgpt model: ${options.model}`);
  }

  // generic api call
  const { data } = await client[adapter.call]({
    ...options,
    ...adapter.prompt(prompt),
  });

  // generic response extract
  return adapter.parse(data);
}

export default function remarkOpenAi({
  apiKey,
  client = new OpenAIApi(new Configuration({ apiKey })),
  ...args
} = {}) {
  return async function transform(tree) {
    const refs = [];

    visit(tree, "code", (node, index, parent) => {
      if (node.lang === "openai") refs.push({ node, index, parent });
    });

    for (const { node, index, parent } of refs) {
      const options = {
        ...DEFAULTS,
        ...args,
        ...json5.parse(node.meta ?? "{}"),
      };

      const textContent = await generateContent(node.value, client, options);
      const contentAst = remark.parse(textContent);

      parent.children[index] = contentAst;
    }
  };
};
