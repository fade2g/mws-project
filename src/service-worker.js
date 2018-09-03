/* globals serviceWorkerOption */
const cachePrefix = "resturant-";
const staticCacheName = `${cachePrefix}static-v13`;

const indexRegex = /^\/(index\.html)?$/gmu;
const restaurantRegex = /restaurant\.html(\?id=[0-9a-zA-Z]*$)+/gmu;
const imageRegex = /img\/.*\.(jpe?g|png|gif|svg)$/iu;
const restaurantId = /\?id=[0-9a-zA-Z]*$/gmu;

const fallbackAssets = {
  index: "index.html",
  restaurant: "restaurant.html",
  noImage: "assets/no_image.svg"
};

self.addEventListener("install", event => {
  event.waitUntil(caches
      .open(staticCacheName)
      .then(cache => cache.addAll(serviceWorkerOption.assets.concat(Object.values(fallbackAssets)))));
});

self.addEventListener("fetch", event => {
  let requestUrl = new URL(event.request.url);

  if (requestUrl.pathname.match(indexRegex)) {
    event.respondWith(caches.match(fallbackAssets.index));
    return;
  }
  if (requestUrl.href.match(restaurantRegex)) {
    event.respondWith(caches.match(fallbackAssets.restaurant));
    return;
  }

  if (requestUrl.href.match(imageRegex)) {
    event.respondWith(cacheOrNetwork(event.request, true)
        .then(response => {
          if (response.ok) {
            return response;
          }
          throw new Error(response.status);
        })
        .catch(() => caches.match(fallbackAssets.noImage)));
    return;
  }

  event.respondWith(cacheOrNetwork(event.request, false));
});

// remove chache of old versions
self.addEventListener("activate", event => {
  event.waitUntil(caches
      .keys()
      .then(cacheNames => Promise.all(cacheNames
            .filter(cacheName => cacheName.startsWith(cachePrefix) &&
                cacheName !== staticCacheName)
            .map(cacheName => caches.delete(cacheName)))));
});

function cacheOrNetwork(request, addToCache = true) {
  return caches.match(request).then(response => response ||
      fetch(request).then(response => caches.open(staticCacheName).then(cache => {
          if (addToCache) {
            cache.put(request, response.clone());
          }
          return response;
        })));
}
