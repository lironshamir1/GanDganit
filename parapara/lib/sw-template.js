// Built by eleventy.config.js. Do not edit _site/sw.js by hand.
// Saves every page of the site on the first visit, then serves it even without internet.
// No personal data is ever cached: the site has none. Only the public pages.
const VERSION = "__VERSION__";
const CACHE = "site-" + VERSION;
const FILES = __FILES__;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      try {
        return await fetch(req);
      } catch (e) {
        if (req.mode === "navigate") return (await cache.match("/")) || Response.error();
        throw e;
      }
    })
  );
});
