import { getAuth } from "@clerk/express";
import {
  ForbiddenException,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class ClerkAclGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    if (context.getType() !== "http") return true;

    const permission = this.reflector.get<string | undefined>(
      "Acl",
      context.getHandler(),
    );

    const req = context.switchToHttp().getRequest();
    const auth = getAuth(req);

    if (!permission || !auth.userId) return true;

    if (!auth.has({ permission })) throw new ForbiddenException();

    return true;
  }
}
