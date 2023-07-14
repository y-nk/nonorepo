import type { NextRequest } from "next/server"

export type Awaitable<T extends any> = T | Promise<T>

export interface NextRoute<
  Req extends any = NextRequest,
  Params extends any = Record<string, string>,
  Returned extends any = Awaitable<Response>
> {
  (req: Req, params: Params): Returned
}

export interface ExtendedRoute<
  Req extends any = NextRequest,
  Params extends any = Record<string, string>,
  Returned extends any = Awaitable<Response>,
  Name extends string = 'unknown',
> extends NextRoute<Req, Params, Returned> {
  __middleware__: Name
}

export interface Middleware<
  Extension extends any = {},
  Req extends any = NextRequest,
  Params extends any = Record<string, string>,
  Returned extends any = Awaitable<Response>
> {
  (next: NextRoute<Req & Extension, Params, Returned>): ExtendedRoute<Req, Params, Returned>
}

export type ExtendedRequest<T> = T extends Middleware<infer Extension, infer Request> ? Request & Extension : never
