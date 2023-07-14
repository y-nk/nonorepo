import type { NextRequest } from "next/server";

import { ApiError } from "next/dist/server/api-utils";

import { Awaitable, Middleware, NextRoute } from "./utils";

/**
 * This middleware is made to automate and minimize necessary code to check
 * on user authentication. It works by relying on the returned value of `getUser` to
 * know if the user is authenticated or not.
 *
 * Example of use:
 *
 * ```ts
 * import { getServerSession } from 'next-auth'
 * import { withAuth } from '@y_nk/next-utils'
 *
 * async function getUser() {
 *   const session = await getServerSession()
 *   return session?.user
 * }
 *
 * export const GET = withAuth((req) => {
 *   return NextResponse.json(req.user)
 * }, getUser)
 * ```
 *
 * @param next the route to wrap in which the user is guaranteed to exist
 * @param getUser the user fetcher function
 * @returns an api route which will handle user authentication check
 */
export function withAuth<T extends any>(
  next: NextRoute<NextRequest & { user: NonNullable<T> }>,
  getUser: () => Awaitable<T>
): NextRoute {
  return async function authHandler(req, params) {
    const user = await getUser()

    if (!user) {
      throw new ApiError(401, 'Unauthorized')
    }

    const reqWithUser = req as unknown as Parameters<typeof next>[0]

    reqWithUser.user = user

    return next(reqWithUser, params)
  }
}

/**
 * A generator function to create a middleware to guard against non-authed requests.
 *
 * Example:
 *
 * ```ts
 * import { createAuthMw } from '@y_nk/next-utils'
 * import { getUser } from '~/lib/auth'
 *
 * const withAuth = createAuthMw(getUser)
 *
 * export const GET = withAuth(async (req) => {
 *   return new Response(JSON.stringify(req.user)))
 * })
 * ```.
 *
 * @param getUser the user fetcher function
 * @returns a middleware ready to use which will ensure that your user is authed and will decorate the request with the returned user property
 */
export function createAuthMw<T extends any>(getUser: () => Awaitable<T>): Middleware<{ user: NonNullable<T> }> {
  return (next) => withAuth(next, getUser)
}
