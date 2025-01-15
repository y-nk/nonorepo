import type { Fetch } from "./types";

import { createCachedFetch } from "./createCachedFetch";
import { createDedupedFetch } from "./createDedupedFetch";

let _fetch: Fetch

export function createFetch() {
  return  _fetch ??= createDedupedFetch(createCachedFetch(globalThis.fetch))
}
