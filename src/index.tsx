import * as React from 'react'

const { useState, useEffect } = React

type Cache = Map<string, any>

type Miss = () => Promise<any>

export function useCache(
  // A map of key => record (storing the miss response)
  cache: Cache,
  // A static key to lookup the resource
  key: string,
  // A function that returns a promise to resolve the data
  miss: Miss,
  // If the cache should be evicted after being set
  {
    shouldImmediatelyEvictCache = (opts: {
      cache: Cache
      key: string
    }): boolean => true,
  } = {},
) {
  // Cache the current value locally, with use state.
  let [value, setValue] = useState(null)
  let [prevKey, setPrevKey] = useState(null)

  if (key !== prevKey) {
    // When the key changes, we need to update the locally cached value. Read
    // the corresponding value from the cache using Suspense.
    value = readCache(cache, key, miss)
    setValue(value)
    setPrevKey(key)
  }

  // Once this value successfully commits, immediately evict it from the cache.
  useEffect(() => {
    if (shouldImmediatelyEvictCache({ cache, key })) {
      evictCache(cache, key)
    }
  }, [cache, key, shouldImmediatelyEvictCache])

  function updateCache(key: string, value: any) {
    cache.set(key, value)
    setValue(value)
  }

  return [value, updateCache]
}

// This rest is a basic Suspense cache implementation.
const PENDING = 0
const RESOLVED = 1
const REJECTED = 2

function readCache(cache: Cache, key: string, miss: Miss) {
  if (cache.has(key)) {
    const record = cache.get(key)
    switch (record.status) {
      case PENDING:
        const promise = record.value
        throw promise
      case RESOLVED:
        const value = record.value
        return value
      case REJECTED:
        const error = record.value
        throw error
    }
  } else {
    const promise = miss()
    const record = {
      status: PENDING,
      value: promise,
      error: undefined,
    }
    promise.then(
      (value) => {
        if (record.status === PENDING) {
          record.status = RESOLVED
          record.value = value
        }
      },
      (error) => {
        if (record.status === PENDING) {
          record.status = REJECTED
          record.value = error
        }
      },
    )
    cache.set(key, record)
    switch (record.status) {
      case PENDING:
        throw promise
      case RESOLVED:
        const value = record.value
        return value
      case REJECTED:
        const error = record.error
        throw error
    }
  }
}

export function evictCache(cache: Cache, key: string) {
  cache.delete(key)
}
