# y_nk's playground

This repo is collection of small independent projects. I've been tired of doing the same "setup a repo, add a npm deploy key" over and over again, yet the setup of a monorepo is a bit overwhelming and doesn't bring much value to me.

So, this is a non-monorepo... monorepo. As in, dependencies are NOT hoisted and there's NO WAY to include one's project into another locally. If one ever had to do that, `npm link` is a good way to fix this.

## How does it work?

Well, every single directory of that repo is considered a project. Each project must comply to the following:

- have a package.json
- use yarn (the ci caches dependencies on yarn.lock)

That's pretty much it. After that everything depends on _optional_ points:

- if you have a `test` npm script, ci will call it on PRs and push to main.
- if you have a `build` npm script, ci will call it on PRs and push to main.
- if you have a `deploy` npm script **and that the package.json version was updated**, ci will call it on push to main (only).

To be flexible, at the cost of security, all the secrets are injected as env var for every single project. we could build a way to inject only what we need, but it's a complexity cost i don't want to have since this thing is intended for me and for me only.

## Can I contribute?

Yes, if you think that the package needs to be released, you can also bump the package version yourself, and if i merge it, it'll be published on npm.

## Can I steal that?

You can. You can fork it, remove all the projects and start brand new in a new repo. Be my guest.
