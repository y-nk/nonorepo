import { clerkClient } from "@clerk/express";
import { Module, type Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { ClerkAclGuard } from "./acl.guard";
import { ClerkAuthGuard } from "./auth.guard";
import { ClerkClaimsGuard } from "./claim.guard";
import { CLERK_CLIENT, CLERK_CONFIG } from "./tokens";
import type { ClerkConfig } from "./types";

const providers: Provider[] = [
  ClerkAuthGuard,
  ClerkAclGuard,
  ClerkClaimsGuard,
  {
    provide: APP_GUARD,
    useExisting: ClerkAuthGuard,
  },
  {
    provide: APP_GUARD,
    useExisting: ClerkAclGuard,
  },
  {
    provide: APP_GUARD,
    useExisting: ClerkClaimsGuard,
  },
  {
    provide: CLERK_CLIENT,
    useValue: clerkClient,
  },
];

@Module({})
export class ClerkModule {
  static register(clerkConfig?: ClerkConfig, global = true) {
    return {
      global,
      module: ClerkModule,
      providers: [
        {
          provide: CLERK_CONFIG,
          useValue: clerkConfig ?? {},
        },
        ...providers,
      ],
      exports: [ClerkAuthGuard, ClerkAclGuard],
    };
  }

  static async registerAsync(provider: Provider<ClerkConfig>, global = true) {
    return {
      global,
      module: ClerkModule,
      providers: [
        {
          provide: CLERK_CONFIG,
          ...provider,
        },
        ...providers,
      ],
      exports: [ClerkAuthGuard, ClerkAclGuard],
    };
  }
}
