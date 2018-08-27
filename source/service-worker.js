const cachePrefix = "resturant-";
const staticCacheName = cachePrefix + "static-v8";

const restaurantRegex = /restaurant\.html(\?id=[0-9a-zA-Z]*$)+/gm;
const restaurantId = /\?id=[0-9a-zA-Z]*$/gm;

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll([
        "css/styles.css",
        "css/styles-600.css",
        "css/styles-960.css",
        "js/dbhelper.js",
        "js/api_token.js",
        "js/main.js",
        "js/restaurant_info.js",
        "js/utilities.js",
        "index.html",
        "restaurant.html",
        "data/restaurants.json"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  let requestUrl = new URL(event.request.url);
  if (requestUrl.href.match(restaurantRegex)) {
    event.respondWith(caches.match("/restaurant.html"));
  }
  event.respondWith(cacheOrNetwork(event.request));
});

// remove chache of old versions
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return (
              cacheName.startsWith(cachePrefix) && cacheName != staticCacheName
            );
          })
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

function cacheOrNetwork(request) {
  return caches.match(request).then(function(response) {
    return (
      response ||
      fetch(request).then(response => {
        return caches.open(staticCacheName).then(cache => {
          cache.put(request, response.clone());
          return response;
        });
      })
    );
  });
}
