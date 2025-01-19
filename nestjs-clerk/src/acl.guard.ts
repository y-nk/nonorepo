import { getAuth } from "@clerk/express";
import {
  ForbiddenException,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { CLERK_ACL } from "./tokens";

@Injectable()
export class ClerkAclGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    if (context.getType() !== "http") return true;

    const permission = this.reflector.get<string | undefined>(
      CLERK_ACL,
      context.getHandler(),
    );

    if (!permission) return true;

    const req = context.switchToHttp().getRequest();
    const auth = getAuth(req);

    if (!auth.has({ permission })) throw new ForbiddenException();

    return true;
  }
}
