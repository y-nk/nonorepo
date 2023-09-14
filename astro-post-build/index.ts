import type { AstroConfig, AstroIntegration } from 'astro'

type AstroBuildDoneParams = Parameters<NonNullable<AstroIntegration['hooks']['astro:build:done']>>[0];
type PostBuildParams = AstroBuildDoneParams & { config: AstroConfig }
type PostBuildAction = (args: PostBuildParams) => void | Promise<void>

export default function createPostBuildIntegration(handler: PostBuildAction): AstroIntegration {
  let config: AstroConfig

  const postBuildInstall: AstroIntegration = {
    name: `astro-post-build:install`,
    hooks: {
      'astro:config:done'(args) {
        config = args.config
        config.integrations.push(postBuildExec)
      },
    }
  }

  const postBuildExec: AstroIntegration = {
    name: `astro-post-build:exec`,
    hooks: {
      async 'astro:build:done'(args) {
        await handler({ config, ...args  })
      }
    }
  }

  return postBuildInstall
}
