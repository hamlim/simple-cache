import { readCache, Cache, Miss, serializeCache } from './shared'

export function useCache<Value>(
  cache: Cache<Value>,
  key: string,
  miss: Miss<Value>,
) {
  let value = readCache<Value>(cache, key, miss)
  return value
}

export { serializeCache }
