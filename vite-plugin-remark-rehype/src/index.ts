import type { Plugin } from "vite";
import type { PluggableList } from "unified";

import { readFile } from "fs/promises";
import { join } from "path";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { Options as RemarkParseOptions } from "remark-parse";
import type { Options as RemarkRehypeOptions } from "remark-rehype";
import type { Options as RehypeStringifyOptions } from "rehype-stringify";

import * as DEFAULT_TEMPLATES from "./templates";
import { TemplateFn } from "./templates/utils";

type PluginOptions = {
  templates?: Record<string, TemplateFn>,
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
  remarkParseOptions?: RemarkParseOptions;
  remarkRehypeOptions?: RemarkRehypeOptions;
  rehypeStringifyOptions?: RehypeStringifyOptions;
};

export * from './templates/utils'

export default function vitePlugin({
  templates = {},
  remarkPlugins = [],
  rehypePlugins = [],
  remarkParseOptions = {},
  remarkRehypeOptions = {},
  rehypeStringifyOptions = {},
}: PluginOptions = {}): Plugin {
  const templateFns = {
    ...DEFAULT_TEMPLATES,
    ...templates,
  }

  // unified plugin stack
  const unifiedPlugins: PluggableList = [
    [remarkParse, remarkParseOptions],
    ...remarkPlugins,
    [remarkRehype, remarkRehypeOptions],
    ...rehypePlugins,
    [rehypeStringify, rehypeStringifyOptions],
  ];

  const compiler = unified().use(unifiedPlugins);

  let rootPath = process.cwd();

  return {
    name: "vite-plugin-remark-rehype",

    configResolved(config) {
      rootPath = config.root;
    },

    async transform(mdContent, id) {
      try {
        const url = new URL(id, 'file://')

        if (url.pathname.endsWith(".md")) {
          const templateName = url.searchParams.get('as') ?? 'string'
          const templateFn = templateFns[templateName] ?? templateFns['string']

          const htmlContent = await compiler.process(mdContent);
          const stringifiedHtml = JSON.stringify(
            htmlContent.toString("utf8")
          )

          return {
            code: templateFn(stringifiedHtml)
          };
        }
      } catch {
        // we dont know what file can be transformed so we're limiting
        // to fs-loaded files for now. if there's a PR or some issue, let's see.
      }
    },

    configureServer: (server) => {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.endsWith(".md")) {
          return next();
        }

        try {
          const fileContent = await readFile(join(rootPath, req.url));
          const htmlContent = await compiler.process(fileContent);

          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(htmlContent.toString("utf-8"));
        } catch {
          next();
        }
      });
    },
  };
}
