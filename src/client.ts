import {
  readCache,
  Cache,
  Miss,
  deserializeCache,
  createRecord,
} from './shared'
import { useState } from 'react'

export { deserializeCache }

export function useCache<Value>(
  cache: Cache<Value>,
  key: string,
  miss: Miss<Value>,
) {
  let [value, setValue] = useState(null)
  let [prevKey, setPrevKey] = useState(null)

  if (key !== prevKey) {
    value = readCache<Value>(cache, key, miss)
    setValue(value)
    setPrevKey(key)
  }

  function updateCache(key: string, value: Value) {
    cache.set(key, createRecord<Value>(value))
    setValue(value)
  }

  return [value, updateCache]
}
