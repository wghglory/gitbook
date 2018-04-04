# resource preload, prefetch

<https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf>

```html
<link rel="preload">
<link rel="prefetch">
```

preload is a declarative fetch, allowing you to force the browser to make a request for a resource without blocking the document’s onload event.

Prefetch is a hint to the browser that a resource might be needed, but delegates deciding whether and when loading it is a good idea or not to the browser.

> Preload resources you have high-confidence will be used in the current page. Prefetch resources likely to be used for future navigation across multiple navigation boundaries.

## Cache Behavior

Chrome has four caches: the HTTP cache, memory cache, Service Worker cache & Push cache.

Both preload and prefetched resources are stored in the HTTP cache.
