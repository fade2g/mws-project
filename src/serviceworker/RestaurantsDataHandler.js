import FetchHandler from "./FetchHandler";
import { DATA_URL } from "../shared/globals";
import { openDatabase, getRestaurants, putRestaurants } from "./database";

/**
 * This function returns a promise that returns the data directly from the database
 * @returns {Promise} Promse that resolves with all restaurants available in the database
 */
const getAllRestaurantsFromDatabase = () => openDatabase()
    .then(getRestaurants)
    .then(restaurants => Promise.resolve(new Response(JSON.stringify(restaurants))));

/**
 * This function fetches all restaurants from the data backend
 * @param {Promise} request Network request
 * @returns {Promise} Promise that resolves to the JSON object for all resraurants accoring to the backen
 */
const fetchAllRestaurantsFromBackend = request => fetch(request).then(response => response.json());

/**
 * This method returns a promise that resolves to the original response data but updates the database with the received data
 * @param {Object} response
 * @returns {Promise} Promise that resolves to the received response after all updates to the DB have finished
 */
const updateDatabaseWithRestaurants = function(response) {
  return openDatabase().then(db => putRestaurants(db, response).then(() => Promise.resolve(response)));
};

/**
 * Implementation of a fetch handler that returns the data for all restaurants.
 * Initially from the indexDB, and the pushes updates for network (and updates the indexDB)
 * The option pbject of the constructor must contain an notify property with a callback function
 * through which the service worker clients are notified of updates from the network response
 * Extends @type FetchHandler
 */
export default class RestaurantsDataHandler extends FetchHandler {
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
    return this.urlFromRequest().href === DATA_URL;
  }

  /**
   * Calls event.respondWith with the "index.html" from the cache
   */
  handle() {
    this.event.respondWith(getAllRestaurantsFromDatabase());
    this.event.waitUntil(fetchAllRestaurantsFromBackend(this.event.request)
        .then(updateDatabaseWithRestaurants)
        .then(response => this.options.notify("update.restaurants", response)));
    return true;
  }
}
