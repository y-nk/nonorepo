export type * from './types'

export * from './createCachedFetch'
export * from './createDedupedFetch'
export * from './getCacheKey'

export * from './policies'
export * from './stores'

import { createFetch } from './createFetch'
export default createFetch()
