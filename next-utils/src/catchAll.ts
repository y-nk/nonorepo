import { ApiError } from "next/dist/server/api-utils";

import type { Middleware, NextRoute } from "./utils";

type ErrorFormat = {
  error: any,
  status: number,
  code?: string,
}

type ErrorMap = (err: unknown) => ErrorFormat | void

/**
 *
 * @param error the error message or error data to pass as the response body
 * @param status status code (default to 500)
 * @param code error code (in case of need, to avoid wrapping it in the error)
 * @returns
 */
export function createErrorFormat(
  error: any = 'server_error',
  status = 500,
  code?: string,
): ErrorFormat {
  return { error, status, code }
}

const ERROR_MAP = (err: unknown) => {
  if (err instanceof ApiError) {
    return createErrorFormat(err.message, err.statusCode)
  } else if (err instanceof Error) {
    return createErrorFormat(err.message)
  }

  return createErrorFormat(err)
}

let globalErrorMap: ErrorMap = (err) => {}

/**
 * This function gives the opportunity to set the error map once and for all
 * in your application.
 *
 * @param newErrorMap a new implementation for a globally defined error map
 */
export function setErrorMap(newErrorMap: ErrorMap) {
  globalErrorMap = newErrorMap
}

/**
 * This middleware is made to control error bubbling in api routes.
 *
 * The function will take as input an api route, which will be wrapped around
 * a try/catch block. if the api route throws any error, this will be caught and
 * passed through a serie of "error maps" functions which goal are to transform
 * error objects into proper http response.
 *
 * There are 2 customisable levels of error map, one global (for every middleware) and
 * one local (for each middleware).
 *
 * Example:
 *
 * ```ts
 * import { catchAll, setErrorMap, createErrorFormat } from '@y_nk/next-utils'
 *
 * // this define a global handler for errors which will
 * setErrorMap((err) => {
 *   if ((err as Error).message.includes('cannot connect to database')) {
 *     return createErrorFormat('database error', 500)
 *   }
 * })
 *
 *
 * export const GET = catchAll(async (req) => {
 *   const users = await db.users.findMany()
 *
 *   if (!users?.length) {
 *     throw { message: 'no users found', status: 204 }
 *   }
 * // this error map will only work for the current middleware
 * }, (err) => {
 *   if (err && typeof err === 'object' && err.message && err.statusCode) {
 *     return createErrorFormat(`custom error: ${err.message}`, 204)
 *   }
 * })
 * ```
 *
 * @param route the api route to wrap
 * @param localErrorMap an optional error map to use for this specific endpoint
 * @returns a wrapper around the given api route which handles try/catch and error responses
 */
export function catchAll(route: NextRoute, localErrorMap?: ErrorMap): NextRoute {
  return async function catchAllHandler(req, params) {
    try {
      return await route(req, params)
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(err)
      }

      const { error, status, code } = localErrorMap?.(err) ?? globalErrorMap(err) ?? ERROR_MAP(err)

      return new Response(
        JSON.stringify({
          code,
          error,
        }), {
          headers: { 'Content-Type': 'application/json '},
          status,
        })
    }
  }
}

/**
 * This function achieves similar goal than `setErrorMap` and `catchAll`
 * in a different manner. Calling this will return a middleware function
 * with a pre-set localErrorMap. This is useful for advanced composition
 * and match the fashion of `createAuthMw`
 *
 * @param localErrorMap a given error map to set for this middleware
 * @returns a catchAll middleware with pre-set local error map
 */
export function createCatchAllMw(localErrorMap: ErrorMap): Middleware {
  return route => catchAll(route, localErrorMap)
}
