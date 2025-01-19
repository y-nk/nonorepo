import { getAuth } from "@clerk/express";
import {
  createParamDecorator,
  SetMetadata,
  type CustomDecorator,
  type ExecutionContext,
} from "@nestjs/common";

export function NoAuth(): CustomDecorator {
  return SetMetadata("NoClerkAuth", true);
}

export function ClerkAcl(permission: string): CustomDecorator {
  return SetMetadata("ClerkAcl", permission);
}

export function ClerkClaims(claims: Record<string, string | number | boolean>): CustomDecorator {
  return SetMetadata("ClerkClaims", claims);
}

export const Clerk = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return getAuth(req);
  },
);
