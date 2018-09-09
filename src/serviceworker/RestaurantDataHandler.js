import FetchHandler from "./FetchHandler";
import {
  restaurantDataUrlRegex,
  badRequestResponse,
  notCachedResponse
} from "./constants";
import { openDatabase, getRestaurantById, putRestaurant } from "./database";

/**
 * This function returns the ID from the query parameter of the request
 * @param {String} url URL that conatins the ID
 * @returns {int} ID of the restaurant from the query paramater
 */
const getIdFromDataUrl = url => {
  const matched = url.match(restaurantDataUrlRegex);
  if (matched.length === 2) {
    return parseInt(matched[1], 10);
  }
  return null;
};

/**
 * This function gets the specific restaurant from the database
 * @param {int} id ID of therestaurant ot be searched in the database
 * @returns {Promise} Promise that resolves to the  restaurant object
 */
const getRestaurantFromDatabase = id => openDatabase()
    .then(db => getRestaurantById(db, id))
    .then(restaurant => {
      if (!restaurant) {
        return Promise.reject(new Error("Restaurant not (yet) available"));
      }
      return Promise.resolve(new Response(JSON.stringify(restaurant)));
    });

/**
 * This method returns a promise that resolves to the original response data but updates the database with the received data
 * @param {Object} response
 * @returns {Promise} Promise that resolves to the received response after all updates to the DB have finished
 */
const updateDatabaseWithRestaurant = function(response) {
  return openDatabase().then(db => putRestaurant(db, response).then(() => Promise.resolve(response)));
};

/**
 * This method fetches the data from the backend
 * @param {Request} request The original fetch request
 * @return {Promise} Promise that resolves then JSON object
 */
const fetchRestaurantFromBackend = request => fetch(request).then(response => response.json());

/**
 * Implementation of a fetch handler that returns the data for a specific restaurants
 * initially from the indexDB, and then pushes update from network (and updates the indexDB)
 * The option object of the constructor must contain an notify property with a callback function
 * through which the service worker clients are notified of the network update
 * Extends @type FetchHandler
 */
export default class RestaurantDataHandler extends FetchHandler {
  constructor(options) {
    if (typeof options.notify !== "function") {
      throw new Error("Missing notify function");
    }
    super(options);
  }

  /**
   * Returns true, if the request is for one of the cached assets
   */
  test() {
    return this.urlFromRequest().href.match(restaurantDataUrlRegex);
  }

  /**
   * Calls event.respondWith with the "index.html" from the cache
   */
  handle() {
    let id = getIdFromDataUrl(this.urlFromRequest().href);
    if (!id) {
      this.event.respondWith(badRequestResponse);
      return;
    }
    this.event.respondWith(getRestaurantFromDatabase(id).catch(() => Promise.resolve(notCachedResponse)));
    this.event.waitUntil(fetchRestaurantFromBackend(this.event.request)
        .then(updateDatabaseWithRestaurant)
        .then(response => this.options.notify("update.restaurant", response)));
    return true;
  }
}
