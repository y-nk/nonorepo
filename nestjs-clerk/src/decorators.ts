import { getAuth } from "@clerk/express";
import {
  createParamDecorator,
  SetMetadata,
  type CustomDecorator,
  type ExecutionContext,
} from "@nestjs/common";
import { CLERK_ACL, CLERK_CLAIMS, NO_CLERK_AUTH } from "./tokens";

export function NoAuth(): CustomDecorator {
  return SetMetadata(NO_CLERK_AUTH, true);
}

export function ClerkAcl(permission: string): CustomDecorator {
  return SetMetadata(CLERK_ACL, permission);
}

export function ClerkClaims(claims: Record<string, string | number | boolean>): CustomDecorator {
  return SetMetadata(CLERK_CLAIMS, claims);
}

export const Clerk = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return getAuth(req);
  },
);
