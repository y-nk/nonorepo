# y_nk's playground

This repo is a collection of small independent projects. I've been tired of doing the same "setup a repo, add an npm deploy key" over and over again, yet setting up a proper monorepo is a bit overwhelming and doesn't bring much value to me.

So, this is a non-monorepo... monorepo. As in, dependencies are NOT hoisted and there's NO WAY to include a project into another locally. If you ever need to do that, `npm link` is a good way to work around it.

## How does it work?

Well, every single directory of this repo is considered a project. Each project must comply with the following:

- have a package.json
- use yarn (the ci caches dependencies on yarn.lock)

That's pretty much it. After that everything depends on _optional_ points:

- if you have a `test` npm script, ci will call it on PRs and push to main.
- if you have a `build` npm script, ci will call it on PRs and push to main.
- if you have a `deploy` npm script **and the package.json version has been updated**, ci will call it on push to main (only).

To be flexible, at the cost of security, all secrets are injected as environment variables for every single project. We could build a way to inject only what we need, but it's a complexity cost I don't want to have since this thing is intended for me and for me only.

## Can I contribute?

Yes, if you think the package needs to be released, you can also bump the package version yourself, and if I merge it, it'll be published on npm.

## Can I steal that?

You can. You can fork it, remove all the projects and start brand new in a new repo. Be my guest.
