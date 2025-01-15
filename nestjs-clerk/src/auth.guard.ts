import { clerkMiddleware, getAuth } from "@clerk/express";
import {
  Inject,
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { CLERK_CONFIG } from "./tokens";
import type { ClerkConfig } from "./types";

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(CLERK_CONFIG) private clerkConfig: ClerkConfig,
  ) {}
  async canActivate(context: ExecutionContext) {
    const noAuth = [context.getHandler(), context.getClass()].some((target) =>
      this.reflector.get<boolean>("NoAuth", target),
    );

    if (context.getType() !== "http" || noAuth) return true;

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const middleware = clerkMiddleware(this.clerkConfig);

    const error = await new Promise<Error | undefined>((resolve) => {
      middleware(req, res, resolve);
    });

    const auth = getAuth(req);

    if (error || !auth.userId) throw new UnauthorizedException();

    return true;
  }
}
