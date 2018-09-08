import FetchHandler from "./FetchHandler";
import { restaurantRegex } from "./constants";
import { getStaticAsset } from "./cache";

/**
 * Implementation for a fetch handler that checks, if the requested resource is the index.html (or "/")
 * and retruns the static index.html
 * Extends @type FetchHandler
 */
export default class RestaurantResourceHandler extends FetchHandler {

  /**
   * Returns true, if the request is for one of the cached assets
   */
  test() {
    return this.urlFromRequest().href.match(restaurantRegex);
  }

  /**
   * Calls event.respondWith with the "restaurant.html" from the cache. Query parameters are removed
   */
  handle() {
    this.event.respondWith(getStaticAsset("/restaurant.html"));
    return true;
  }
}
