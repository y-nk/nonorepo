import { visit } from "unist-util-visit";
import json5 from 'json5';

export default function remarkCodeDataset(options) {
  return function transform(tree, file) {
    visit(tree, 'code', function(node) {
      if (!node.meta) return

      try {
        const attrs = json5.parse(node.meta);

        const {
          exclude = [],
          include = Object.keys(attrs)
        } = options ?? {}

        node.data ??= {}

        node.data.hProperties = Object.fromEntries(
          Object.entries(attrs)
            .filter(([k]) => !exclude.includes(k))
            .filter(([k]) => include.includes(k))
            .map(([k, v]) => [`data-${k}`, v])
        )
      } catch {
        if (process.env.NODE_ENV !== 'production') {
          const [filename] = file.history
          console.error(`[remark-code-dataset] Invalid JSON5 structure in ${filename}: ${node.meta}; ignoring.`)
        }
      }
    })
  }
}
