import {
  openDatabase,
  getRestaurantById,
  getRestaurants,
  putRestaurant,
  putRestaurants
} from "./database";
import AppResourcesHandler from "./AppResourcesHandler";
import IndexResourcesHandler from "./IndexResourceHandler";
import RestaurantResourceHandler from "./RestaurantResourceHandler";
import RestaurantsDataHandler from "./RestaurantsDataHandler";
import RestaurantDataHandler from "./RestaurantDataHandler";
import RestaurantImageHandler from "./RestaurantImageHandler";
import {
  restaurantDataUrlRegex,
  cachePrefix,
  staticCacheName,
  imageCacheName,
  restaurantImageUrlRegex,
  restaurantImageSuffixRefex
} from "./constants";

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
fetchHandlers.push(new RestaurantsDataHandler({notify: notifyClients}));
fetchHandlers.push(new RestaurantDataHandler({notify: notifyClients}));
fetchHandlers.push(new RestaurantImageHandler());

self.addEventListener("install", event => {
  event.waitUntil(caches
      .open(staticCacheName)
      .then(cache => cache.addAll(serviceWorkerOption.assets.concat(Object.values(fallbackAssets)))));
});

self.addEventListener("fetch", event => {
  let requestUrl = new URL(event.request.url);
  const handlers = fetchHandlers.filter(handler => handler.withEvent(event).test());
  let done = handlers.map(handler => handler.handle());
  if (done.length > 0) {
    return;
  }

  // Handle request for image and provide fallback asset
  // if (requestUrl.href.match(imageRegex)) {
  //   respondWithImageOrFallbackAsset(event);
  //   return;
  // }
  // Handle request for data of all restaurants
  // if (requestUrl.href === DATA_URL) {
  //   handleAllResturantsFetch(event);
  //   return;
  // }
  // Handle request for data of single restaurants
  // if (requestUrl.href.match(restaurantDataUrlRegex)) {
  //   let id = getIdFromDataUrl(requestUrl.href);
  //   if (!id) {
  //     event.respondWith(badRequestResponse);
  //     return;
  //   }
  //   event.respondWith(getRestaurantFromDatabase(id).catch(() => Promise.resolve(notCachedResponse)));
  //   event.waitUntil(fetchRestaurantFromBackend(event.request)
  //       .then(updateDatabaseWithRestaurant)
  //       .then(response => notifyClients("update.restaurants", response)));
  //   return;
  // }
  // Handle request for restaurant image. The restaurant image will be cached / returned from cache independent of requested resolution
  // if (requestUrl.href.match(restaurantImageUrlRegex)) {
  //   const cacheUrl = event.request.url.replace(restaurantImageSuffixRefex, "");
  //   event.respondWith(getImageFromCacheOrNetwork(event.request, cacheUrl));
  //   return;
  // }

  // normal fallthrough handling
  event.respondWith(fetch(event.request));
  // event.respondWith(cacheOrNetwork(event.request, false));
});

const getIdFromDataUrl = url => {
  const matched = url.match(restaurantDataUrlRegex);
  if (matched.length === 2) {
    return parseInt(matched[1], 10);
  }
  return null;
};

/**
 * This function returns a promise that returns the data directly from the database
 * @returns {Promise} Promse that resolves with all restaurants available in the database
 */
const getAllRestaurantsFromDatabase = () => openDatabase().then(db => getRestaurants(db).then(restaurants => Promise.resolve(new Response(JSON.stringify(restaurants)))));

const getRestaurantFromDatabase = id => openDatabase()
    .then(db => getRestaurantById(db, id))
    .then(restaurant => {
      if (!restaurant) {
        return Promise.reject(new Error("Restaurant not (yet) available"));
      }
      return Promise.resolve(new Response(JSON.stringify(restaurant)));
    });

/**
 * This method fetches the data from the backend
 * @param {Request} request The original fetch request
 * @return {Promise} Promise that resolves then JSON object
 */
const fetchAllRestaurantsFromBackend = request => fetch(request).then(response => response.json());

/**
 * This method fetches the data from the backend.
 * It's the same as for all restaurants, as it is s simple fetch
 * @param {Request} request The original fetch request
 * @return {Promise} Promise that resolves then JSON object
 */
const fetchRestaurantFromBackend = fetchAllRestaurantsFromBackend;

/**
 * This method returns a promise that resolves to the original response data but updates the database with the received data
 * @param {Object} response
 * @returns {Promise} Promise that resolves to the received response after all updates to the DB have finished
 */
const updateDatabaseWithRestaurants = function(response) {
  return openDatabase().then(db => putRestaurants(db, response).then(() => Promise.resolve(response)));
};

/**
 * This method returns a promise that resolves to the original response data but updates the database with the received data
 * @param {Object} response
 * @returns {Promise} Promise that resolves to the received response after all updates to the DB have finished
 */
const updateDatabaseWithRestaurant = function(response) {
  return openDatabase().then(db => putRestaurant(db, response).then(() => Promise.resolve(response)));
};

// remove chache of old versions
self.addEventListener("activate", event => {
  event.waitUntil(caches
      .keys()
      .then(cacheNames => Promise.all(cacheNames
            .filter(cacheName => cacheName.startsWith(cachePrefix) &&
                cacheName !== staticCacheName &&
                cacheName !== imageCacheName)
            .map(cacheName => caches.delete(cacheName)))));
});

function handleAllResturantsFetch(event) {
  event.respondWith(getAllRestaurantsFromDatabase());
  event.waitUntil(fetchAllRestaurantsFromBackend(event.request)
      .then(updateDatabaseWithRestaurants)
      .then(response => notifyClients("update.restaurants", response)));
}

function getImageFromCacheOrNetwork(request, cacheUrl) {
  return caches.open(imageCacheName).then(cache => cache.match(cacheUrl).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then(fetchResponse => {
        if (fetchResponse.ok) {
          cache.put(cacheUrl, fetchResponse.clone());
          return fetchResponse;
        }
        return caches
          .open(staticCacheName)
          .then(cache => cache.match(fallbackAssets.noImage));
      });
    }));
}

function cacheOrNetwork(request, addToCache = true) {
  return caches.match(request).then(response => response ||
      fetch(request).then(response => caches.open(staticCacheName).then(cache => {
          if (addToCache) {
            cache.put(request, response.clone());
          }
          return response;
        })));
}
