# `@matthamlin/simple-cache`

A simple react-cache implementation using hooks.

## API

```js
import { useCache } from '@matthamlin/simple-cache'

let cache = new Map()

function useFetch(endpoint) {
  return useCache(cache, endpoint, () =>
    fetch(endpoint).then((data) => data.json()),
  )
}
```

### `useCache` Arguments:

- `cache` - A cache, expects the same api as a `Map`
- `key` - A unique key (string) to index the cache by
- `fetcher` - A function that returns a promise to suspend (function)
- `options` - An options object that exposes some advanced features
  - `shouldImmediatelyEvictCache` - A function called with both key and cache:
    `{ key: string, cache: Map<string, any> }` that returns a boolean to
    indicate if the cache should be evicted.
  - `shouldRefetch` - A function called with the key that returns a boolean
    indicating if the value for that key should be refetched

### Built Using:

- Typescript
- Babel
- Jest
