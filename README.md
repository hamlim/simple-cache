# `@matthamlin/simple-cache`

A simple react-cache implementation that works for both Server Components and
Client Components!

## API

```tsx
// For use on the client, or in client components during SSR
import { useCache } from '@matthamlin/simple-cache/client'

let cache = new Map()

interface Result = {
  something: boolean
}

function useFetch(endpoint) {
  return useCache<Result>(cache, endpoint, () =>
    fetch(endpoint).then((data) => data.json()),
  )
}
```

Or with Server Components (experimental):

```tsx
import { useCache } from '@matthamlin/simple-cache/server';

let cache = new Map();

interface Result = {
  something: boolean
}

function useData(endpoint) {
  return useCache<Result>(cache, endpoint, () =>
    fetch(endpoint).then(res => res.json()),
  )
}
```

### `useCache` Arguments:

- `cache` - A cache, expects the same api as a `Map`
- `key` - A unique key (string) to index the cache by
- `miss` - A function that returns a promise to suspend (function)

### Recipes:

#### Sharing a cache between the server and the client:

<!-- prettier-ignore -->
> **Note:** 
> I haven't done extensive testing with this approach, but it could
> work!

The `server` entrypoint also exports a `serializeCache` function that takes in
the `cache` and returns a stringified representation of the cache. It's up to
you to pass that data down to the client, one possible approach is a `<script>`
tag injected alongside the component that suspended on the server!

On the client, you can import `deserializeCache` from the `client` entrypoint
and pass that stringified representation to it to get back the `cache` which you
can pass through to all `useCache` calls.

As long as the keys are equivalent, this should allow you to avoid double
fetching on the client.

<!-- prettier-ignore -->
> **Note:**
> This doesn't yet work for _pending_ `useCache` calls, not that I'd
> expect the server to flush those to the client 🤔

### Built Using:

- Typescript
- Babel
