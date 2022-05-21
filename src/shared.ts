export type Entry<Value> =
  | {
      status: 0
      value: void
      promise: Promise<Value>
    }
  | {
      status: 1
      value: Value
      promise: Promise<Value>
    }
  | {
      status: 2
      value: void
      promise: Promise<Value>
      error: Error
    }

export type Cache<Value> = Map<string, Entry<Value>>

export type Miss<Value> = () => Promise<Value>

// This rest is a basic Suspense cache implementation.
const PENDING = 0
const RESOLVED = 1
const REJECTED = 2

export function readCache<Value>(
  cache: Cache<Value>,
  key: string,
  miss: Miss<Value>,
) {
  if (cache.has(key)) {
    let record = cache.get(key)
    switch (record.status) {
      case PENDING:
        let promise = record.promise
        throw promise
      case RESOLVED:
        let value = record.value
        return value
      case REJECTED:
        let error = record.error
        throw error
    }
  } else {
    let promise = miss()
    let record = {
      status: PENDING,
      promise,
      value: undefined,
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
          record.error = error
        }
      },
    )
    cache.set(key, record as Entry<Value>)
    switch (record.status) {
      case PENDING:
        throw promise
      case RESOLVED:
        let value = record.value
        return value
      case REJECTED:
        let error = record.error
        throw error
    }
  }
}

export function createRecord<Value>(value: Value): {
  status: 1
  value: Value
  promise: Promise<Value>
} {
  return {
    status: RESOLVED,
    value,
    promise: Promise.resolve(value),
  }
}

// Serialization and Deserialization

function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: [...value],
    }
  } else if (value instanceof Error) {
    return {
      dataType: 'Error',
      value: value.toString(),
    }
  } else if (value instanceof Promise) {
    return null
  } else {
    return value
  }
}

function reviver(key, value) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value)
    } else if (value.dataType === 'Error') {
      return new Error(value.value)
    }
  }
  return value
}

export function serializeCache(cache: Map<string, unknown>) {
  return JSON.stringify(cache, replacer)
}

// @TODO - this doesn't handle pending records all that well (promise is null)
export function deserializeCache(data: string) {
  return JSON.parse(data, reviver)
}
