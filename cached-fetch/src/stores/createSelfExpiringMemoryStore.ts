import { Store } from "../types";

import { createMemoryStore } from "./createMemoryStore";

const DEFAULT_TTL = 1000;

type Milliseconds = number;

interface Options {
    ttl?: Milliseconds;
}

export function createSelfExpiringMemoryStore<T>(options: Options = {}): Store<T> {
    const store = createMemoryStore<T>()
    const timers = new Map<string, ReturnType<typeof setTimeout>>()
    const { ttl = DEFAULT_TTL } = options

    return {
        has(key) {
            return store.has(key)
        },
        get(key) {
            return store.get(key)
        },
        set(key, value, date?) {
            clearTimeout(timers.get(key))
            timers.set(
                key,
                setTimeout(() => store.del(key), ttl),
            )
            return store.set(key, value, date)
        },
        del(key) {
            clearTimeout(timers.get(key))
            return store.del(key)
        },
        clear() {
            timers.forEach((timeout) => clearTimeout(timeout))
            return store.clear()
        },
    };
}
