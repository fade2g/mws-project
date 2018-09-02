/* globals serviceWorkerOption */
const cachePrefix = "resturant-";
const staticCacheName = `${cachePrefix}static-v11`;

const restaurantRegex = /restaurant\.html(\?id=[0-9a-zA-Z]*$)+/gmu;
const restaurantId = /\?id=[0-9a-zA-Z]*$/gmu;

self.addEventListener("install", event => {
  event.waitUntil(caches
      .open(staticCacheName)
      .then(cache => cache.addAll(serviceWorkerOption.assets)));
});

/* TODO Implement cahcing strategy
self.addEventListener("fetch", event => {
  let requestUrl = new URL(event.request.url);
  if (requestUrl.href.match(restaurantRegex)) {
    event.respondWith(caches.match("/restaurant.html"));
  }
  event.respondWith(cacheOrNetwork(event.request));
});

*/

// remove chache of old versions
self.addEventListener("activate", event => {
  event.waitUntil(caches
      .keys()
      .then(cacheNames => Promise.all(cacheNames
            .filter(cacheName => cacheName.startsWith(cachePrefix) &&
                cacheName !== staticCacheName)
            .map(cacheName => caches.delete(cacheName)))));
});

function cacheOrNetwork(request) {
  return caches.match(request).then(response => response ||
      fetch(request).then(response => caches.open(staticCacheName).then(cache => {
          cache.put(request, response.clone());
          return response;
        })));
}
