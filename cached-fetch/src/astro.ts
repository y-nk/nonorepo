import type { AstroIntegration } from 'astro'

export default (): AstroIntegration => ({
  name: '@y_nk/cached-fetch',
  hooks: {
    'astro:config:setup': ({ injectScript }) => {
      injectScript('page-ssr', `import '@y_nk/cached-fetch/register'`)
    }
  }
})
