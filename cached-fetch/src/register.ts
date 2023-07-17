import { createFetch } from './createFetch'

// @ts-ignore
global._fetch = global.fetch
global.fetch = createFetch()
