import { expect, it, vi } from 'vitest'

import { createDedupedFetch } from './createDedupedFetch'
import { Fetch } from './types'

const url = 'http://localhost:3000/'

const spiedFetch = vi.spyOn(globalThis, 'fetch')
  .mockImplementation(async () => new Response('hello world'))

const dedupedFetch = createDedupedFetch(spiedFetch as unknown as Fetch)

it('dedupe concurrent requests', async () => {
  const p1 = dedupedFetch(url)
  const p2 = dedupedFetch(url)

  expect(p2).toStrictEqual(p1)
  expect(spiedFetch).toHaveBeenCalledOnce()

  const r1 = await p1
  const r2 = await p2

  expect(r2).not.toStrictEqual(r1)
  expect(await r1.text()).toBe('hello world')
  expect(await r2.text()).toBe('hello world')
})
