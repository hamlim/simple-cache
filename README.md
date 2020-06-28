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

### Built Using:

- Typescript
- Babel
- Jest
