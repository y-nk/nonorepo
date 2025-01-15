import { getAuth } from "@clerk/express";
import {
  createParamDecorator,
  SetMetadata,
  type CustomDecorator,
  type ExecutionContext,
} from "@nestjs/common";

export function NoAuth(): CustomDecorator {
  return SetMetadata("NoAuth", true);
}

export function Acl(permission: string): CustomDecorator {
  return SetMetadata("Acl", permission);
}

export const Clerk = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return getAuth(req);
  },
);
