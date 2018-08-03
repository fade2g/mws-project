var staticCacheName = "restaurant-static-v4";

self.addEventListener("fetch", event => {
  let requestUrl = new URL(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).then(response => {
        return caches.open(staticCacheName).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        })
      });
    })
  );
});
