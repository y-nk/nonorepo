import { readFile } from 'fs/promises'

const EXPORTS_DEFAULT = 'export default '

/**
 * This part is quite unstable. It has been scavenged by:
 *   1. manually creating a MyComp.astro file containing exactly what i wanted to have (an svg with a {...Astro.props} spread)
 *   2. adding a `console.log({ transformResult }) here https://github.com/withastro/astro/blob/84e573a781b46d79deeebc5ce6dc620696073580/packages/astro/src/vite-plugin-astro/index.ts#L160
 *
 * We could improve by trying to release a astro file into vite, but i don't know how to do this
 */
const template = `import {
  render,
  createAstro,
  createComponent,
  spreadAttributes,
} from "astro/server/index.js";

const Astro = createAstro();

const SVG = createComponent(async (result, props, slots) => {
  const _Astro = result.createAstro(Astro, props, slots);
  Astro.self = SVG;
  return render\`<svg \${spreadAttributes(_Astro.props, "props")}%%svg%%\`;
}, "%%id%%");

${EXPORTS_DEFAULT}SVG;

if (import.meta.hot) import.meta.hot.decline()`

export default function svgAstroLoader() {
  return {
    enforce: 'pre',
    name: 'astro-svg-loader',

    async transform(code, id) {
      if (!id.endsWith('.svg?comp')) return null

      // remove the annoying querystring
      id = id.replace('?comp', '')

      // this is because the `@astrojs/image` transforms the file already
      // and replaces with the url to load instead of the real source
      if (code.startsWith(EXPORTS_DEFAULT)) {
        code = code.replace(EXPORTS_DEFAULT, '')
        code = await readFile(id, 'utf-8')
      }

      return {
        code: template
          .replace('%%id%%', id)
          // the `<svg` is already in the template since we want to spread Astro props.
          .replace('%%svg%%', code.replace('<svg', ''))
      }
    },
  }
}
