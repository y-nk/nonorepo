import {
  expect,
  it,
} from 'vitest'
import { getCacheKey } from './getCacheKey'

it('returns false if the request is not get', async () => {
  const returned = getCacheKey('http://localhost:3000/', { method: 'post' })
  expect(returned).toBe(false)
})

it('computes cache key for string', async () => {
  const input = 'http://localhost:3000/'

  const returned = getCacheKey(input)
  const expected = '{"credentials":"same-origin","destination":"","headers":{},"integrity":"","method":"GET","mode":"cors","redirect":"follow","referrer":"about:client","referrerPolicy":"","url":"http://localhost:3000/"}'

  expect(returned).toBe(expected)
})

it('computes cache key for string with some parameters in init', async () => {
  const input = 'http://localhost:3000/'
  const init: RequestInit = {
    cache: 'no-cache',
    headers: {
      'User-Agent': 'foobar',
      'Authorization': 'Bearer FooBar',
    }
  }

  const returned = getCacheKey(input, init)
  const expected = '{"credentials":"same-origin","destination":"","headers":{"authorization":"Bearer FooBar","user-agent":"foobar"},"integrity":"","method":"GET","mode":"cors","redirect":"follow","referrer":"about:client","referrerPolicy":"","url":"http://localhost:3000/"}'

  expect(returned).toBe(expected)
})

it('works with request object', async () => {
  const input = new Request('http://localhost:3000/?foo=bar')

  const returned = getCacheKey(input)
  const expected = '{"credentials":"same-origin","destination":"","headers":{},"integrity":"","method":"GET","mode":"cors","redirect":"follow","referrer":"about:client","referrerPolicy":"","url":"http://localhost:3000/?foo=bar"}'

  expect(returned).toBe(expected)
})
