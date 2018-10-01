import { isOwnCache, isCurrentCache, cacheAssets } from "./cache";
import OnlineHandler from "./OnlineHandler";
import AppResourcesHandler from "./AppResourcesHandler";
import IndexResourcesHandler from "./IndexResourceHandler";
import RestaurantResourceHandler from "./RestaurantResourceHandler";
import RestaurantsDataHandler from "./RestaurantsDataHandler";
import RestaurantDataHandler from "./RestaurantDataHandler";
import RestaurantImageHandler from "./RestaurantImageHandler";
import ReviewsHandler from "./ReviewsHandler";
import LikeHandler from "./LikeHandler";
import { transientCacheName } from "./constants";
import ReviewSubmitHandler from "./ReviewSubmitHandler";

/* globals serviceWorkerOption */

const fallbackAssets = {
  index: "index.html",
  restaurant: "restaurant.html",
  noImage: "assets/no_image.svg"
};

/** Here are the hardcoded service worker options */
const serviceWorkerOption = {
  assets: [
    "/sw.js.map",
    "/main.js",
    "/single.js",
    "/styles.css",
    "/styles.js",
    "/main.js.map",
    "/single.js.map",
    "/styles.css.map",
    "/styles.js.map"
  ]
};

/**
 * The method pushes received data from the backend to the service worker listeners
 * @param {String} type String with the type of the notification
 * @param {Object} response The parsed JSON object with the backend response
 * @return {Promise} Resolved promise after posting the update messages to the clients
 */
const notifyClients = function(type, payload) {
  return self.clients.matchAll().then(clients => {
    const message = {
      type,
      payload
    };
    clients.forEach(client => {
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
fetchHandlers.push(new ReviewsHandler({ notify: notifyClients }));
fetchHandlers.push(new ReviewSubmitHandler({ notify: notifyClients }));
fetchHandlers.push(new LikeHandler());

self.addEventListener("install", event => {
  event.waitUntil(cacheAssets(serviceWorkerOption.assets.concat(Object.values(fallbackAssets))));
});

self.addEventListener("fetch", event => {
  const handlers = fetchHandlers.filter(handler => handler.withEvent(event).test());
  let done = handlers.map(handler => handler.handleFetch());
  if (done.length > 0) {
    return;
  }
  event.respondWith(cacheOrNetwork(event.request, true));
});

// Attach handler for online state
const onlineHandler = new OnlineHandler(self);
onlineHandler.attachListener();

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
