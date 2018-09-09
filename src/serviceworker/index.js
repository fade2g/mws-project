import { isOwnCache, isCurrentCache, cacheAssets } from "./cache";
import AppResourcesHandler from "./AppResourcesHandler";
import IndexResourcesHandler from "./IndexResourceHandler";
import RestaurantResourceHandler from "./RestaurantResourceHandler";
import RestaurantsDataHandler from "./RestaurantsDataHandler";
import RestaurantDataHandler from "./RestaurantDataHandler";
import RestaurantImageHandler from "./RestaurantImageHandler";
import { transientCacheName } from "./constants";

/* globals serviceWorkerOption */

const fallbackAssets = {
  index: "index.html",
  restaurant: "restaurant.html",
  noImage: "assets/no_image.svg"
};

/**
 * The method pushes received data from the backend to the service worker listeners
 * @param {String} type String with the type of the notification
 * @param {Object} response The parsed JSON object with the backend response
 * @return {Promise} Resolved promise after posting the update messages to the clients
 */
const notifyClients = function(type, payload) {
  return self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      const message = {
        type,
        payload
      };
      client.postMessage(JSON.stringify(message));
    });
  });
};

const fetchHandlers = [];
fetchHandlers.push(new AppResourcesHandler({ serviceWorkerOption }));
fetchHandlers.push(new IndexResourcesHandler());
fetchHandlers.push(new RestaurantResourceHandler());
fetchHandlers.push(new RestaurantsDataHandler({ notify: notifyClients }));
fetchHandlers.push(new RestaurantDataHandler({ notify: notifyClients }));
fetchHandlers.push(new RestaurantImageHandler());

self.addEventListener("install", event => {
  event.waitUntil(cacheAssets(serviceWorkerOption.assets.concat(Object.values(fallbackAssets))));
});

self.addEventListener("fetch", event => {
  const handlers = fetchHandlers.filter(handler => handler.withEvent(event).test());
  let done = handlers.map(handler => handler.handle());
  if (done.length > 0) {
    return;
  }

  // event.respondWith(fetch(event.request));
  event.respondWith(cacheOrNetwork(event.request, true));
});

// remove cache of old versions
self.addEventListener("activate", event => {
  event.waitUntil(caches
      .keys()
      .then(cacheNames => Promise.all(cacheNames
            .filter(cacheName => isOwnCache(cacheName) && !isCurrentCache(cacheName))
            .map(cacheName => caches.delete(cacheName)))));
});

function cacheOrNetwork(request, addToCache = true) {
  return caches.match(request).then(response => response ||
      fetch(request).then(response => caches.open(transientCacheName).then(cache => {
          if (addToCache) {
            cache.put(request, response.clone());
          }
          return response;
        })));
}
