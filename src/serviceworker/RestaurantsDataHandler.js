import FetchHandler from "./FetchHandler";
import { restaurantsDataUrlRegex } from "./constants";
import { openDatabase, getRestaurants, putRestaurants } from "./database";
import {
  UPDATE_RESTAURANTS_MESSAGE_TYPE,
  UPDATE_OPTIONS_MESSAGE_TYPE
} from "../shared/globals";

/**
 * This function returns a promise that returns the data directly from the database
 * @returns {Promise} Promse that resolves with all restaurants available in the database
 */
const getAllRestaurantsFromDatabase = () => openDatabase().then(getRestaurants);
// .then(restaurants => Promise.resolve(new Response(JSON.stringify(restaurants))));

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
 * Function to only let the objects remain, if the given property is the criterai
 * @param {String} filterProperty Name of the property, on which the filter shall be applied
 * @param {String=} criteria Criteria to be fulfilled. Is undefined, "all" is the default value
 */
const propertyFilterFactory = (filterProperty, criteria = "all") => function(element) {
    return criteria === "all" || element[filterProperty] === criteria;
  };

/**
 * Filters the restaurant to only return those mathing the cuisine and neightborhood
 * @param {Object[]=} restaurants List of restaurants
 * @param {String=} cuisine Cuisine to be filtered for
 * @param {String=} neighborhood Nightborhood to be filtered for
 */
const filterRestaurants = (restaurants = [], cuisine, neighborhood) => restaurants
    .filter(propertyFilterFactory("cuisine_type", cuisine))
    .filter(propertyFilterFactory("neighborhood", neighborhood));

const metaOnyExtractor = (restaurants = [], metaOnly = false) => restaurants.map(restaurant => {
    if (!metaOnly) {
      return restaurant;
    }
    return (({ cuisine_type, neighborhood }) => ({
      cuisine_type,
      neighborhood
    }))(restaurant);
  });

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
    return this.urlFromRequest().href.match(restaurantsDataUrlRegex);
  }

  /**
   * Calls event.respondWith with the "index.html" from the cache
   */
  handle() {
    let cuisine = this.urlFromRequest().searchParams.get("c");
    let neighborhood = this.urlFromRequest().searchParams.get("n");
    let metaOnly =
      this.urlFromRequest().searchParams.get("metaOnly") === true ||
      this.urlFromRequest().searchParams.get("metaOnly") === "true";
    let messageType = UPDATE_RESTAURANTS_MESSAGE_TYPE;
    if (metaOnly === true) {
      messageType = UPDATE_OPTIONS_MESSAGE_TYPE;
    }
    this.event.respondWith(getAllRestaurantsFromDatabase().then((restaurants = []) => {
        const response = new Response(
          JSON.stringify(metaOnyExtractor(
              filterRestaurants(restaurants, cuisine, neighborhood),
              metaOnly
            )),
          { status: 200 }
        );
        return Promise.resolve(response);
      }));
    const newUrl = this.urlFromRequest();
    newUrl.searchParams.delete("c");
    newUrl.searchParams.delete("n");
    newUrl.searchParams.delete("metaOnly");
    this.event.waitUntil(fetchAllRestaurantsFromBackend(new Request(newUrl), this.event.request)
        .then(restaurants => Promise.resolve(filterRestaurants(restaurants, cuisine, neighborhood)))
        .then(updateDatabaseWithRestaurants)
        .then(response => this.options.notify(messageType, metaOnyExtractor(response, metaOnly))));
    return true;
  }
}
