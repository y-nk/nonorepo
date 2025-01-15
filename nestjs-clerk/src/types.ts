import type { AuthObject, clerkMiddleware } from "@clerk/express";

export type ClerkConfig = Parameters<typeof clerkMiddleware>[0];

// & is to enforce the discriminating union since the type is not available at @clerk/express
export type ClerkAuth = AuthObject & { sessionId: string };
