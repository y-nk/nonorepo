import { getAuth } from "@clerk/express";
import {
  ForbiddenException,
  Injectable,
  type CanActivate,
  type ExecutionContext
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { get } from "./utils";

type ClerkClaims = Record<string, string | number | boolean>

@Injectable()
export class ClerkClaimsGuard implements CanActivate {
  constructor (private reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    if (context.getType() !== "http") return true;

    const claims = this.reflector.get<ClerkClaims | undefined>(
      "ClerkClaims",
      context.getHandler(),
    );

    if (!claims) return true;

    const req = context.switchToHttp().getRequest();
    const auth = getAuth(req);

    const result = Object
      .entries(claims)
      .map(([k, v]) => get(auth.sessionClaims ?? {}, k) === v)
      .every(Boolean)

    if (!result) throw new ForbiddenException();

    return true;
  }
}
