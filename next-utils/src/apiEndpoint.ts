/* eslint-disable no-unused-vars */
import type { NextRequest } from 'next/server';

import type { Awaitable, NextRoute } from './utils';

/**
 * The returned type by an ApiRoute when it succeeded
 */
export type Success<S> = {
  success: true
  data: S
}

/**
 * The returned type by an ApiRoute when it failed
 */
export type Failure<F> = {
  success: false
  errors: F
}

/**
 * A wrapper around NextRoute which returns an object such
 * as { success: true, data: S } | { success: false, errors: F }
 */
export interface ApiRoute<
  R extends NextRequest = NextRequest,
  P extends any = unknown,
  S = unknown,
  F = unknown,
> {
//  (req: R): Awaitable<(Success<S> | Failure<F>) & ResponseInit>
  (req: R, params: P): Awaitable<(Success<S> | Failure<F>) & ResponseInit>
}

/**
 * The definition of the intermediate handler which is returned to
 * Next. We use this as a mean to carry on the types S and F through
 * useless properties.
 */
export type ApiHandler<T, P, S, F> = NextRoute & {
  __meta__: {
    name: T;
    params: P,
    success: S;
    failure: F;
  }
};

/**
 * A tupled version of the types of an ApiEndpoint. The result type
 * of ApiEndpoint<T> can be used in the `submit` function on the
 * client-side.
 */
export type ApiEndpoint<T extends ApiHandler<any, any, any, any>> = T['__meta__']

export function success<S extends any>(data: S): Success<S> {
  return { success: true, data }
}

export function failure<F extends any>(errors: F): Failure<F> {
  return { success: false, errors }
}

// FIXME: helper. for some reason we can't use peerDep NextResponse
function json(data: any, status: number, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    status,
    ...init,
    headers: {
      ...init.headers,
      'content-type': 'application/json'
    }
  })
}

/**
 * This function create a wrapper around a Next.JS api route to answer typed
 * data instead of a Response. The typed are kept in the api route returned, so that
 * we can extract them later on.
 *
 * Example:
 *
 * ```ts
 * export const GET = endpoint(async (req) => {
 *   try {
 *     const users = await getUsersFromDatabase()
 *     return success(users)
 *   } catch (error) {
 *     return failure(error)
 *   }
 * })
 *
 * export type GetAllUsersEndpoint = ApiEndpoint<typeof GET>
 * ```
 *
 * @param route A special api route which does not return a response, but rather
 * either a success() or failure() call.
 * @returns a next route to be consumed
 */
export function endpoint<
  R extends NextRequest,
  P extends any,
  S extends any,
  F extends any,
  T extends string,
>(name: T, route: ApiRoute<R, P, S, F>) {
  const handler: ApiHandler<T, P, S, F> = async (req, params = {}) => {
    try {
      // @ts-expect-error
      const res = await route(req, params);

      if (res.success) {
        return json({ data: res.data }, 200, res)
      } else {
        return json({ errors: res.errors }, 400, res)
      }
    } catch (error) {
      return json({ errors: [error] }, 500)
    }
  };

  // dummy type carriers for type inference
  handler.__meta__ = {
    name: name,
    params: undefined as P,
    success: undefined as S,
    failure: undefined as F,
  }

  return handler;
}

export function isEndpoint(handler: any): handler is ApiHandler<any, any, any, any> {
  return typeof handler === 'function' && handler.__meta__
}
