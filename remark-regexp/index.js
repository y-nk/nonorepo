import { visit } from "unist-util-visit";

/**
 * @type {object} Expression
 * @property {(str) => boolean} test
 * @property {(str) => Replacement} replace
 */

/**
 * @type {@typedef {import('hast').Element} Element | string} Replacement
 */

/** @param {Expression[]} exprs */
export default function remarkRegexp(exprs = []) {
  return function transform(tree) {
    visit(tree, "text", function (node, _, parent) {
      const { test, replace } = exprs
        .find(({ test }) => test.test(node.value)) ?? {}

      if (!test) return

      const [str, ...groups] = test.exec(node.value)

      const replacement = typeof replace === 'function'
        ? replace(node.value, groups)
        : replace

      const { tagName, properties } = typeof replacement === 'string'
        ? { tagName: replacement }
        : replacement

      node.value = node.value.replace(test, '')

      const { data = {} } = parent

      if (tagName)
        data.hName = tagName

      if (properties)
        data.hProperties = {
          ...data.hProperties,
          ...properties,
        }

      parent.data = data
    });
  };
}
