import type { CachedFetchOptions } from "../createCachedFetch";

import { defaultPolicy } from "./defaultPolicy";
import { forceCachePolicy } from "./forceCachePolicy";
import { noCachePolicy } from "./noCachePolicy";
import { noStorePolicy } from "./noStorePolicy";
import { onlyIfCachedPolicy } from "./onlyIfCachedPolicy";
import { reloadPolicy } from "./reloadPolicy";

export * from "./defaultPolicy";
export * from "./forceCachePolicy";
export * from "./noCachePolicy";
export * from "./noStorePolicy";
export * from "./onlyIfCachedPolicy";
export * from "./reloadPolicy";

export const DEFAULT_POLICIES: CachedFetchOptions['policies'] = {
  'default': defaultPolicy,
  'force-cache': forceCachePolicy,
  'no-cache': noCachePolicy,
  'no-store': noStorePolicy,
  'only-if-cached': onlyIfCachedPolicy,
  'reload': reloadPolicy,
}
