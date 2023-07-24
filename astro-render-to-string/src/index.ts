// @ts-ignore
import { createAstro } from "astro/server/index.js";
// @ts-ignore
import { renderChild } from "astro/server/render/any";
// @ts-ignore
import { isAstroComponentFactory } from "astro/server/render/astro/factory";

const Astro = createAstro();

type Opts = {
  cookies?: any;
  params?: any;
  props?: any;
  slots?: any;
  renderers?: any;
  request?: any;
  response?: any;
  url?: any;
};

function notSupported(feat: string) {
  throw new Error(`[astro-render-to-string] ${feat} not supported`);
}

/**
 * createResult is not exposed (but is in 'astro/core/render/result'),
 * but we can mock it for very little support, which is  good enough
 * for rendering components only.
 */
function createResult({
  cookies,
  params = {},
  props = {},
  renderers = [],
  request,
  response,
  url,
}: Opts = {}) {
  return {
    styles: new Set(),
    scripts: new Set(),
    links: new Set(),
    componentMetadata: new Map(),
    clientDirectives: new Map(),
    compressHTML: true,
    pathname: "",
    createAstro(result: any, props: any, slots: any) {
      return {
        // cannot use notSupported here
        clientAddress: undefined,
        redirect() {
          notSupported("redirect");
        },
        ...Astro,
        ...result,
        props,
        slots,
      };
    },
    _metadata: {
      hasHydrationScript: false,
      hasRenderedHead: false,
      hasDirectives: new Set(),
      headInTree: false,
      extraHead: [],
      propagators: new Map(),
    },
    cookies,
    params,
    props,
    renderers,
    request,
    response,
    url,
  };
}

export async function renderToString(
  child: any, // What to render
  opts: Opts = {} // passing props etc
) {
  if (isAstroComponentFactory(child)) {
    child = child(createResult(opts), opts.props ?? {}, opts.slots ?? {});
  }

  let render = "";
  for await (const part of renderChild(child)) {
    if (typeof part === "string" || part instanceof String) {
      render += part;
    } else {
      console.warn("[astro-render-to-string] unsupported part:", part);
    }
  }
  return render;
}
