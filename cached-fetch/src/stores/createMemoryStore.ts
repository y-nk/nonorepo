import { Store } from "../types";

export function createMemoryStore<T>(): Store<T> {
  let store = new Map<string, { value: T, date: Date }>()

  return {
    del: (...args) => store.delete(...args),
    get: (...args) => store.get(...args) ?? {},
    has: (key) => store.get(key)?.date,
    set: (key, value, date = new Date()) => {
      store.set(key, { value, date })
    },
    clear: () => {
      store = new Map<string, { value: T, date: Date }>()
    }
  }
}
